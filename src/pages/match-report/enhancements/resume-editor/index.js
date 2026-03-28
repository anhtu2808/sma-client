import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { message } from 'antd';

import { useGetResumeQuery, useUpdateEnhancementContentMutation } from '@/apis/resumeApi';
import Loading from '@/components/Loading';
import EntryHeader from './EntryHeaderNode';
import { buildResumeHtml } from './buildResumeHtml';
import MenuBar from './MenuBar';
import './resumeEditor.css';

const AUTOSAVE_DELAY = 4000;

const EXTENSIONS = [
  StarterKit,
  Underline,
  TextStyleKit,
  EntryHeader,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Link.configure({ openOnClick: false, autolink: true }),
  Image,
];

const ResumeEditor = ({ resumeId, enhancementId, initialContent }) => {
  const { data: resumeData, isLoading } = useGetResumeQuery(
    { resumeId },
    { skip: !resumeId }
  );
  const [updateContent] = useUpdateEnhancementContentMutation();

  const [saveStatus, setSaveStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
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

  if (isLoading || !resumeData) {
    return <Loading className="py-20" />;
  }

  return (
    <div className="resume-editor flex flex-col h-full">
      <MenuBar editor={editor} onSave={handleManualSave} isSaving={isSaving} saveStatus={saveStatus} />
      <div className="flex-1 overflow-y-auto bg-gray-200 py-10 flex justify-center">
        <div
          className="w-[210mm] min-h-[297mm] h-fit bg-white shadow-2xl px-[50px] py-[40px] cursor-text"
          onClick={() => editor?.chain().focus().run()}
        >
          <EditorContent editor={editor} className="tiptap-content" />
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
