import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { useGetResumeQuery, useUpdateEnhancementContentMutation } from '@/apis/resumeApi';
import { useMarkDetailAsFixedMutation } from '@/apis/matchingApi';
import { setDetailFixed, updateScoresAfterFixed } from '@/store/slices/matchingReportSlice';
import Loading from '@/components/Loading';
import EntryHeader from './EntryHeaderNode';
import SuggestionHighlight from './extensions/SuggestionHighlight';
import { buildResumeHtml } from './buildResumeHtml';
import MenuBar from './MenuBar';
import HighlightDetailModal from './HighlightDetailModal';
import useEditorHighlights from './hooks/useEditorHighlights';
import useTypewriterFix from './hooks/useTypewriterFix';
import useFixUndoStack from './hooks/useFixUndoStack';
import { findTextInDocFuzzy } from './utils/prosemirrorSearch';
import './resumeEditor.css';

const AUTOSAVE_DEBOUNCE = 3000;
const AUTOSAVE_INTERVAL = 3000;

const EXTENSIONS = [
  StarterKit,
  Underline,
  TextStyleKit,
  EntryHeader,
  SuggestionHighlight,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Link.configure({ openOnClick: false, autolink: true }),
  Image,
];

const ResumeEditor = ({ resumeId, enhancementId, initialContent, onEditorReady, onRegenerateSuggestions, isRegenerating }) => {
  const dispatch = useDispatch();
  const { data: resumeData, isLoading } = useGetResumeQuery(
    { resumeId },
    { skip: !resumeId }
  );
  const [updateContent] = useUpdateEnhancementContentMutation();

  const [saveStatus, setSaveStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [tagModalDetail, setTagModalDetail] = useState(null);
  const criteriaScores = useSelector(
    (state) => state.matchingReport.data?.criteriaScores
  );
  const autoSaveTimerRef = useRef(null);
  const initialSaveDoneRef = useRef(false);
  const lastSavedHtmlRef = useRef(null);

  const initialHtml = useMemo(() => {
    if (initialContent) return initialContent;
    if (!resumeData) return '';
    return buildResumeHtml(resumeData);
  }, [initialContent, resumeData]);

  const editor = useEditor({
    extensions: EXTENSIONS,
    content: initialHtml || '',
    editable: true,
  }, [initialHtml]);

  const saveContent = useCallback(async (html) => {
    if (!enhancementId || !html) return;
    if (html === lastSavedHtmlRef.current) return;

    setIsSaving(true);
    try {
      await updateContent({ id: enhancementId, content: html }).unwrap();
      lastSavedHtmlRef.current = html;
      setSaveStatus('Saved');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {
      message.error('Failed to save changes');
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
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => {
        saveContent(editor.getHTML());
      }, AUTOSAVE_DEBOUNCE);
    };
    editor.on('update', handleUpdate);

    // Periodic: save every 3s if there are unsaved changes
    const intervalId = setInterval(() => {
      if (editor.isDestroyed) return;
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
  }, [editor, enhancementId, saveContent]);

  const handleManualSave = () => {
    if (!editor) return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    saveContent(editor.getHTML());
  };

  // Tag click handler — check if user clicked on the ::before tag area
  const handleEditorClick = useCallback((event) => {
    const highlightEl = event.target.closest('[data-tag="true"]');
    if (!highlightEl) return;

    // Check if click was in the tag area (above the highlight text, within the ::before zone)
    const rect = highlightEl.getBoundingClientRect();
    const clickY = event.clientY;
    // The tag ::before is positioned at top: -20px, height 18px — so above the element
    const isTagArea = clickY < rect.top + 2;

    if (!isTagArea) return;

    event.preventDefault();
    event.stopPropagation();

    const detailId = Number(highlightEl.dataset.detailId);
    if (!Number.isFinite(detailId) || !criteriaScores) return;

    const detail = criteriaScores
      .flatMap((cs) => cs.details || [])
      .find((d) => d.id === detailId);

    if (detail) {
      setTagModalDetail(detail);
    }
  }, [criteriaScores]);

  const handleModalClose = useCallback(() => {
    setTagModalDetail(null);
  }, []);

  // Derive modal detail from Redux (avoids stale state + infinite re-render)
  const tagModalDetailId = tagModalDetail?.id ?? null;
  const resolvedModalDetail = useMemo(() => {
    if (!tagModalDetailId || !criteriaScores) return null;
    return criteriaScores
      .flatMap((cs) => cs.details || [])
      .find((d) => d.id === tagModalDetailId) ?? null;
  }, [tagModalDetailId, criteriaScores]);

  // Auto-close modal when detail transitions to fixed (not if already fixed on open)
  const wasFixedOnOpenRef = useRef(false);
  useEffect(() => {
    // Track whether detail was already fixed when modal opened
    wasFixedOnOpenRef.current = !!resolvedModalDetail?.isFixed;
  }, [tagModalDetailId]); // reset on modal open/change

  useEffect(() => {
    if (resolvedModalDetail?.isFixed && !wasFixedOnOpenRef.current) {
      const timer = setTimeout(() => setTagModalDetail(null), 500);
      return () => clearTimeout(timer);
    }
  }, [resolvedModalDetail?.isFixed]);

  // AI highlight decorations synced from Redux
  useEditorHighlights(editor);

  // Typewriter fix animation
  const { applyFix, fixingDetailId, cancelAnimation } = useTypewriterFix();

  // Fix undo stack — rolls back isFixed state when Ctrl+Z is pressed
  const { pushFixUndo } = useFixUndoStack(editor);

  const fixInEditor = useCallback(
    async (context, suggestionText, detailId) => {
      if (!editor) return false;

      const success = await applyFix(editor, context, suggestionText, detailId);
      if (!success) {
        message.error('Could not find matching text in your resume. Please edit manually.');
      }
      return success;
    },
    [editor, applyFix]
  );

  // Cleanup animation on unmount
  useEffect(() => {
    return () => cancelAnimation();
  }, [cancelAnimation]);

  // One-click optimize: apply first suggestion for all findable contexts
  const [markDetailAsFixed] = useMarkDetailAsFixedMutation();
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimizeAll = useCallback(async () => {
    if (!editor || !criteriaScores || isOptimizing) return;

    setIsOptimizing(true);

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
      const success = await applyFix(editor, detail.context, suggestionText, detail.id);
      if (!success) continue;

      // Collect all detail IDs sharing same contextId for marking
      const detailIds = detail.contextId
        ? criteriaScores.flatMap((cs) => cs.details || []).filter((d) => d.contextId === detail.contextId && !d.isFixed).map((d) => d.id)
        : [detail.id];

      for (const id of detailIds) {
        try {
          const response = await markDetailAsFixed({ detailId: id }).unwrap();
          dispatch(setDetailFixed({ detailId: id }));
          if (response) {
            dispatch(updateScoresAfterFixed({
              afterOverallScore: response.afterOverallScore,
              criteriaScoreId: response.criteriaScoreId,
              afterCriteriaScore: response.afterCriteriaScore,
            }));
          }
        } catch { /* continue with next */ }
      }

      applied++;

      // Small pause between items so user can follow
      await new Promise((r) => setTimeout(r, 300));
    }

    setIsOptimizing(false);
    if (applied > 0) {
      message.success(`Optimized ${applied} suggestion${applied > 1 ? 's' : ''} successfully.`);
      saveContent(editor.getHTML());
    } else {
      message.info('No suggestions could be applied automatically.');
    }
  }, [editor, criteriaScores, isOptimizing, markDetailAsFixed, dispatch, saveContent, applyFix]);

  // Expose fixInEditor + fixingDetailId + editor + pushFixUndo to parent via callback
  useEffect(() => {
    onEditorReady?.({ fixInEditor, fixingDetailId, editor, pushFixUndo });
  }, [fixInEditor, fixingDetailId, editor, pushFixUndo, onEditorReady]);

  if (isLoading || !resumeData) {
    return <Loading className="py-20" />;
  }

  return (
    <div className="resume-editor flex flex-col h-full">
      <MenuBar editor={editor} onSave={handleManualSave} isSaving={isSaving} saveStatus={saveStatus} onRegenerateSuggestions={onRegenerateSuggestions} isRegenerating={isRegenerating} />
      <div className="relative flex-1 overflow-y-auto bg-gray-200 py-10 flex justify-center">
        <div
          className="w-[210mm] min-h-[297mm] h-fit bg-white shadow-2xl px-[50px] py-[40px] cursor-text"
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
