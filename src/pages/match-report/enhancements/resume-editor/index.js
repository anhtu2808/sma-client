import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { message } from 'antd';
import { useSelector } from 'react-redux';

import { useGetResumeQuery, useUpdateEnhancementContentMutation } from '@/apis/resumeApi';
import Loading from '@/components/Loading';
import EntryHeader from './EntryHeaderNode';
import SuggestionHighlight from './extensions/SuggestionHighlight';
import { buildResumeHtml } from './buildResumeHtml';
import MenuBar from './MenuBar';
import HighlightDetailModal from './HighlightDetailModal';
import useEditorHighlights from './hooks/useEditorHighlights';
import useTypewriterFix from './hooks/useTypewriterFix';
import './resumeEditor.css';

const AUTOSAVE_DELAY = 4000;

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

const ResumeEditor = ({ resumeId, enhancementId, initialContent, onEditorReady }) => {
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

  // First visit (content null): save generated HTML immediately
  useEffect(() => {
    if (!resumeData || !editor || initialSaveDoneRef.current) return;
    if (!initialContent && initialHtml) {
      initialSaveDoneRef.current = true;
      saveContent(initialHtml);
    } else {
      initialSaveDoneRef.current = true;
      lastSavedHtmlRef.current = initialContent;
    }
  }, [resumeData, editor, initialHtml, initialContent, saveContent]);

  // Auto-save on editor update (debounced)
  useEffect(() => {
    if (!editor) return;
    const handleUpdate = () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => {
        saveContent(editor.getHTML());
      }, AUTOSAVE_DELAY);
    };
    editor.on('update', handleUpdate);
    return () => {
      editor.off('update', handleUpdate);
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [editor, saveContent]);

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

  // Auto-close modal when detail becomes fixed
  useEffect(() => {
    if (resolvedModalDetail?.isFixed) {
      const timer = setTimeout(() => setTagModalDetail(null), 500);
      return () => clearTimeout(timer);
    }
  }, [resolvedModalDetail?.isFixed]);

  // AI highlight decorations synced from Redux
  useEditorHighlights(editor);

  // Typewriter fix animation
  const { applyFix, fixingDetailId, cancelAnimation } = useTypewriterFix();

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

  // Expose fixInEditor + fixingDetailId + editor to parent via callback
  useEffect(() => {
    onEditorReady?.({ fixInEditor, fixingDetailId, editor });
  }, [fixInEditor, fixingDetailId, editor, onEditorReady]);

  if (isLoading || !resumeData) {
    return <Loading className="py-20" />;
  }

  return (
    <div className="resume-editor flex flex-col h-full">
      <MenuBar editor={editor} onSave={handleManualSave} isSaving={isSaving} saveStatus={saveStatus} />
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
