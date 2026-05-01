import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { useDispatch, useSelector } from 'react-redux';
import toastMessage from '@/utils/toastMessage';

import {
  useGetResumeQuery,
  useRedoEnhancementVersionMutation,
  useUndoEnhancementVersionMutation,
  useUpdateEnhancementContentMutation,
} from '@/apis/resumeApi';
import { useMarkDetailAsFixedBatchMutation } from '@/apis/matchingApi';
import {
  applySuggestionState,
  setActiveCriteriaId,
  setDetailFixed,
  setFocusedItemId,
  setHighlightModalDetailId,
  updateScoresAfterFixed,
} from '@/store/slices/matchingReportSlice';
import Loading from '@/components/Loading';
import EntryHeader from './EntryHeaderNode';
import SuggestionHighlight from './extensions/SuggestionHighlight';
import PreserveStyles from './extensions/PreserveStyles';
import SmartBreakSpacer from './extensions/SmartBreakSpacer';
import { buildResumeHtml } from './buildResumeHtml';
import MenuBar from './MenuBar';
import HighlightDetailModal from './HighlightDetailModal';
import useEditorHighlights from './hooks/useEditorHighlights';
import useTypewriterFix from './hooks/useTypewriterFix';
import useFixUndoStack from './hooks/useFixUndoStack';
import applySuggestionFix from './utils/applySuggestionFix';
import { findTextInDocFuzzy } from './utils/prosemirrorSearch';
import './resumeEditor.css';

const AUTOSAVE_DEBOUNCE = 15000;
const AUTOSAVE_INTERVAL = 60000;

const EXTENSIONS = [
  StarterKit,
  Underline,
  TextStyleKit,
  EntryHeader,
  SuggestionHighlight,
  PreserveStyles,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Link.configure({ openOnClick: false, autolink: true }),
  Image,
  // A4 page-break visualization: inserts spacer decoration widgets before any
  // top-level block that would otherwise straddle a page boundary.
  SmartBreakSpacer,
];

const ResumeEditor = ({
  resumeId,
  enhancementId,
  initialContent,
  onEditorReady,
  onRegenerateSuggestions,
  isRegenerating,
  onReScore,
  isReScoring,
  reScoreStatus,
  onExport,
  isExporting,
  onOpenHistory,
  onVersionRestored,
}) => {
  const dispatch = useDispatch();
  const { data: resumeData, isLoading } = useGetResumeQuery(
    { resumeId },
    { skip: !resumeId }
  );
  const [updateContent] = useUpdateEnhancementContentMutation();
  const [undoEnhancementVersion, { isLoading: isBackendUndoing }] = useUndoEnhancementVersionMutation();
  const [redoEnhancementVersion, { isLoading: isBackendRedoing }] = useRedoEnhancementVersionMutation();

  const [saveStatus, setSaveStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [backendHistoryState, setBackendHistoryState] = useState({ canUndo: true, canRedo: false });
  const matchData = useSelector((state) => state.matchingReport.data);
  const criteriaScores = useSelector(
    (state) => state.matchingReport.data?.criteriaScores
  );
  const highlightModalDetailId = useSelector(
    (state) => state.matchingReport.ui.highlightModalDetailId
  );
  const autoSaveTimerRef = useRef(null);
  const initialSaveDoneRef = useRef(false);
  const initialEditorHtmlRef = useRef('');
  const initialEditorEnhancementIdRef = useRef(null);
  const lastSavedHtmlRef = useRef(null);
  const suppressAutosaveRef = useRef(false);

  const resolvedInitialHtml = useMemo(() => {
    if (initialContent) return initialContent;
    if (!resumeData) return '';
    return buildResumeHtml(resumeData);
  }, [initialContent, resumeData]);

  if (initialEditorEnhancementIdRef.current !== enhancementId) {
    initialEditorEnhancementIdRef.current = enhancementId;
    initialEditorHtmlRef.current = resolvedInitialHtml;
  } else if (!initialEditorHtmlRef.current && resolvedInitialHtml) {
    initialEditorHtmlRef.current = resolvedInitialHtml;
  }

  const initialHtml = initialEditorHtmlRef.current || resolvedInitialHtml;

  const editor = useEditor({
    extensions: EXTENSIONS,
    content: initialHtml || '',
    editable: true,
  }, [enhancementId]);

  // Typewriter fix animation
  const { applyFix, fixingDetailId, cancelAnimation } = useTypewriterFix();
  const [markDetailAsFixedBatch] = useMarkDetailAsFixedBatchMutation();

  // Fix undo stack — reconciles fixed-state side effects after native undo restores the previous doc
  const { pushFixUndo } = useFixUndoStack(editor);

  const saveContent = useCallback(async (html, saveType = 'AUTOSAVE') => {
    if (!enhancementId || !html) return;
    if (saveType === 'AUTOSAVE' && html === lastSavedHtmlRef.current) return;

    setIsSaving(true);
    try {
      await updateContent({ id: enhancementId, content: html, saveType }).unwrap();
      lastSavedHtmlRef.current = html;
      setSaveStatus('Saved');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {
      toastMessage.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  }, [enhancementId, updateContent]);

  // Track initial content as already-saved baseline (no initial save needed — content set at creation)
  useEffect(() => {
    if (!editor || initialSaveDoneRef.current) return;
    initialSaveDoneRef.current = true;
    lastSavedHtmlRef.current = initialContent || initialHtml;
  }, [editor, initialContent, initialHtml]);

  // Auto-save: debounce after edit + periodic interval
  useEffect(() => {
    if (!editor || !enhancementId) return;

    // Debounce: save 3s after last edit
    const handleUpdate = () => {
      if (suppressAutosaveRef.current || fixingDetailId) return;
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => {
        if (suppressAutosaveRef.current || fixingDetailId) return;
        saveContent(editor.getHTML());
      }, AUTOSAVE_DEBOUNCE);
    };
    editor.on('update', handleUpdate);

    // Periodic: save every 3s if there are unsaved changes
    const intervalId = setInterval(() => {
      if (editor.isDestroyed) return;
      if (suppressAutosaveRef.current || fixingDetailId) return;
      const html = editor.getHTML();
      if (html && html !== lastSavedHtmlRef.current) {
        saveContent(html);
      }
    }, AUTOSAVE_INTERVAL);

    return () => {
      editor.off('update', handleUpdate);
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      clearInterval(intervalId);
    };
  }, [editor, enhancementId, saveContent, fixingDetailId]);

  const handleManualSave = useCallback(() => {
    if (!editor) return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    saveContent(editor.getHTML(), 'MANUAL_SAVE');
  }, [editor, saveContent]);

  const applyVersionResponse = useCallback((response) => {
    if (!editor || !response?.content) return;

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    suppressAutosaveRef.current = true;
    editor.commands.setContent(response.content, false);
    lastSavedHtmlRef.current = response.content;
    dispatch(applySuggestionState(response.suggestionState));
    setBackendHistoryState({
      canUndo: Boolean(response.canUndo),
      canRedo: Boolean(response.canRedo),
    });
    onVersionRestored?.(response);

    setTimeout(() => {
      suppressAutosaveRef.current = false;
    }, 0);
  }, [dispatch, editor, onVersionRestored]);

  const handleBackendUndo = useCallback(async () => {
    if (!editor || !enhancementId || isBackendUndoing) return;
    if (editor.can().undo()) {
      editor.chain().focus().undo().run();
      return;
    }

    try {
      const response = await undoEnhancementVersion({ enhancementId }).unwrap();
      applyVersionResponse(response);
    } catch (error) {
      toastMessage.info(error?.data?.message || 'Nothing to undo');
      setBackendHistoryState((state) => ({ ...state, canUndo: false }));
    }
  }, [applyVersionResponse, editor, enhancementId, isBackendUndoing, undoEnhancementVersion]);

  const handleBackendRedo = useCallback(async () => {
    if (!editor || !enhancementId || isBackendRedoing) return;
    if (editor.can().redo()) {
      editor.chain().focus().redo().run();
      return;
    }

    try {
      const response = await redoEnhancementVersion({ enhancementId }).unwrap();
      applyVersionResponse(response);
    } catch (error) {
      toastMessage.info(error?.data?.message || 'Nothing to redo');
      setBackendHistoryState((state) => ({ ...state, canRedo: false }));
    }
  }, [applyVersionResponse, editor, enhancementId, isBackendRedoing, redoEnhancementVersion]);

  // Cmd/Ctrl shortcuts for save and persistent undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!(e.metaKey || e.ctrlKey)) return;

      const key = e.key.toLowerCase();
      if (key === 's') {
        e.preventDefault();
        handleManualSave();
      } else if (key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleBackendRedo();
        } else {
          handleBackendUndo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [handleBackendRedo, handleBackendUndo, handleManualSave]);

  // Editor tag-badge click opens the modal at the FIRST detail of the clicked context.
  const handleEditorClick = useCallback((event) => {
    const badgeEl = event.target.closest('.suggestion-tag__badge');
    const tagEl = badgeEl?.closest('.suggestion-tag') || event.target.closest('.suggestion-tag');
    if (!tagEl) return;

    event.preventDefault();
    event.stopPropagation();

    const clickedId = Number(badgeEl?.dataset.detailId || tagEl.dataset.detailId);
    if (!Number.isFinite(clickedId) || !criteriaScores) return;

    const owningCriteria = criteriaScores.find((cs) =>
      (cs.details || []).some((d) => d.id === clickedId)
    );
    const allDetails = criteriaScores.flatMap((cs) => cs.details || []);
    const clicked = allDetails.find((d) => d.id === clickedId);
    if (!clicked) return;

    const firstSibling = clicked.contextId != null
      ? allDetails.find((d) => d.contextId === clicked.contextId) || clicked
      : clicked.context
        ? allDetails.find((d) => d.contextId == null && d.context === clicked.context) || clicked
      : clicked;

    if (owningCriteria?.id != null) {
      dispatch(setActiveCriteriaId(owningCriteria.id));
    }
    dispatch(setFocusedItemId(clicked.id));
    dispatch(setHighlightModalDetailId(firstSibling.id));

    // Let the sidebar render the switched criteria first, then scroll its item into view.
    setTimeout(() => {
      const el = document.getElementById(`sidebar-item-${firstSibling.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  }, [criteriaScores, dispatch]);

  const handleModalClose = useCallback(() => {
    dispatch(setHighlightModalDetailId(null));
    dispatch(setFocusedItemId(null));
  }, [dispatch]);

  const resolvedModalDetail = useMemo(() => {
    if (!highlightModalDetailId || !criteriaScores) return null;
    return criteriaScores
      .flatMap((cs) => cs.details || [])
      .find((d) => d.id === highlightModalDetailId) ?? null;
  }, [highlightModalDetailId, criteriaScores]);

  // Auto-close modal when detail transitions to fixed (not if already fixed on open).
  const wasFixedOnOpenRef = useRef(false);
  useEffect(() => {
    wasFixedOnOpenRef.current = !!resolvedModalDetail?.isFixed;
  }, [highlightModalDetailId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (resolvedModalDetail?.isFixed && !wasFixedOnOpenRef.current) {
      const timer = setTimeout(() => dispatch(setHighlightModalDetailId(null)), 500);
      return () => clearTimeout(timer);
    }
  }, [resolvedModalDetail?.isFixed, dispatch]);

  // AI highlight decorations synced from Redux
  useEditorHighlights(editor);

  const fixInEditor = useCallback(
    async (context, suggestionText, detailId) => {
      if (!editor) return false;

      const result = await applyFix(editor, context, suggestionText, detailId);
      if (!result?.success) {
        toastMessage.error('Could not find matching text in your resume. Please edit manually.');
      }
      return result;
    },
    [editor, applyFix]
  );

  const applySuggestion = useCallback(
    async ({ detailId, suggestionId, context, suggestionText, detailIds }) => {
      suppressAutosaveRef.current = true;
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      try {
        const result = await applySuggestionFix({
          detailId,
          suggestionId,
          context,
          suggestionText,
          detailIds,
          editor,
          enhancementId,
          matchData,
          fixInEditor,
          markDetailAsFixedBatch,
          dispatch,
          pushFixUndo,
        });
        if (result?.success && result?.statusUpdated && result?.content) {
          lastSavedHtmlRef.current = result.content;
        }
        return result;
      } finally {
        suppressAutosaveRef.current = false;
      }
    },
    [editor, enhancementId, matchData, fixInEditor, markDetailAsFixedBatch, dispatch, pushFixUndo]
  );

  // Cleanup animation on unmount
  useEffect(() => {
    return () => cancelAnimation();
  }, [cancelAnimation]);

  // One-click optimize: apply first suggestion for all findable contexts
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimizeAll = useCallback(async () => {
    if (!editor || !criteriaScores || isOptimizing) return;

    setIsOptimizing(true);
    suppressAutosaveRef.current = true;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

    // Collect all unique contexts with their details (dedup by context text)
    const seen = new Set();
    const items = [];
    for (const cs of criteriaScores) {
      for (const detail of cs.details || []) {
        if (!detail.context || detail.isFixed || seen.has(detail.context)) continue;
        if (!detail.suggestions?.length) continue;
        seen.add(detail.context);
        items.push(detail);
      }
    }

    let applied = 0;
    const appliedDetailIds = new Set();

    try {
      for (const detail of items) {
        const suggestionText = detail.suggestions[0]?.suggestion;
        if (!suggestionText) continue;

        // Check if text exists in current doc state
        const ranges = findTextInDocFuzzy(editor.state.doc, detail.context);
        if (ranges.length === 0) continue;

        // Scroll to the text before replacing
        const { from } = ranges[0];
        const resolvedPos = editor.state.doc.resolve(from);
        const domPos = editor.view.domAtPos(resolvedPos.pos);
        const targetNode = domPos.node?.nodeType === 1 ? domPos.node : domPos.node?.parentElement;
        if (targetNode) {
          targetNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Brief pause so user can see where the edit happens
          await new Promise((r) => setTimeout(r, 400));
        }

        // Apply typewriter animation (sequential — waits for each to finish)
        const result = await applyFix(editor, detail.context, suggestionText, detail.id);
        if (!result?.success) continue;

        // Collect all detail IDs sharing same contextId for marking
        const detailIds = detail.contextId
          ? criteriaScores.flatMap((cs) => cs.details || []).filter((d) => d.contextId === detail.contextId && !d.isFixed).map((d) => d.id)
          : [detail.id];

        detailIds.forEach((id) => appliedDetailIds.add(id));
        applied++;

        // Small pause between items so user can follow
        await new Promise((r) => setTimeout(r, 300));
      }

      if (applied > 0) {
        const detailIds = [...appliedDetailIds];
        const content = editor.getHTML();
        const response = await markDetailAsFixedBatch({
          detailIds,
          enhancementId,
          content,
        }).unwrap();

        detailIds.forEach((id) => dispatch(setDetailFixed({ detailId: id })));
        if (response) {
          dispatch(updateScoresAfterFixed({
            afterOverallScore: response.afterOverallScore,
            criteriaScoreId: response.criteriaScoreId,
            afterCriteriaScore: response.afterCriteriaScore,
          }));
        }
        lastSavedHtmlRef.current = content;
        toastMessage.success(`Optimized ${applied} suggestion${applied > 1 ? 's' : ''} successfully.`);
      } else {
        toastMessage.info('No suggestions could be applied automatically.');
      }
    } catch {
      toastMessage.error('Optimized text but failed to save version history.');
    } finally {
      suppressAutosaveRef.current = false;
      setIsOptimizing(false);
    }
  }, [editor, criteriaScores, isOptimizing, markDetailAsFixedBatch, enhancementId, dispatch, applyFix]);

  // Expose editor actions to parent via callback
  useEffect(() => {
    onEditorReady?.({ fixInEditor, applySuggestion, fixingDetailId, editor, pushFixUndo, applyVersionResponse });
  }, [fixInEditor, applySuggestion, fixingDetailId, editor, pushFixUndo, applyVersionResponse, onEditorReady]);

  if (isLoading || !resumeData) {
    return <Loading className="py-20" />;
  }

  return (
    <div className="resume-editor flex flex-col h-full">
      <MenuBar
        editor={editor}
        onSave={handleManualSave}
        isSaving={isSaving}
        saveStatus={saveStatus}
        onUndo={handleBackendUndo}
        onRedo={handleBackendRedo}
        canBackendUndo={backendHistoryState.canUndo}
        canBackendRedo={backendHistoryState.canRedo}
        isBackendUndoing={isBackendUndoing}
        isBackendRedoing={isBackendRedoing}
        onOpenHistory={onOpenHistory}
        onRegenerateSuggestions={onRegenerateSuggestions}
        isRegenerating={isRegenerating}
        onReScore={onReScore}
        isReScoring={isReScoring}
        reScoreStatus={reScoreStatus}
        onExport={onExport}
        isExporting={isExporting}
      />
      <div className="relative flex-1 overflow-y-auto bg-gray-200 py-10 flex justify-center items-start">
        <div
          className="bg-white cursor-text"
          style={{
            width: 794, // A4 width @ 96 DPI
            paddingLeft: 50,
            paddingRight: 50,
            paddingTop: 40,
            paddingBottom: 40,
          }}
          onClick={(e) => {
            handleEditorClick(e);
            if (!e.defaultPrevented) {
              editor?.chain().focus().run();
            }
          }}
        >
          <EditorContent editor={editor} className="tiptap-content" />
        </div>
        <HighlightDetailModal
          detail={resolvedModalDetail}
          open={resolvedModalDetail !== null}
          onClose={handleModalClose}
          onFixApplied={handleModalClose}
        />
      </div>
    </div>
  );
};

export default ResumeEditor;
