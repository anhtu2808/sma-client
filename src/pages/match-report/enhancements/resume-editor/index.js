import { useMemo, useRef, useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { Select } from 'antd';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  IndentDecrease,
  IndentIncrease,
  Code,
  Palette,
} from 'lucide-react';

import EntryHeader from './EntryHeaderNode';
import { buildResumeHtml } from './buildResumeHtml';
import './resumeEditor.css';

// ── Toolbar ────────────────────────────────────────────────────────

const ToolbarButton = ({ onClick, isActive, icon: Icon, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`p-1.5 flex items-center justify-center rounded text-gray-700 hover:bg-gray-200 transition-colors
      ${isActive ? 'bg-gray-200 text-black' : ''}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
  </button>
);

const Divider = () => <div className="w-px h-6 bg-gray-300 mx-1" />;

// Professional CV color palette
const CV_COLORS = [
  { value: '#000000', label: 'Black' },
  { value: '#1f2937', label: 'Dark Gray' },
  { value: '#374151', label: 'Gray' },
  { value: '#6b7280', label: 'Muted Gray' },
  { value: '#2551A5', label: 'CV Blue' },
  { value: '#1e40af', label: 'Dark Blue' },
  { value: '#1a56db', label: 'Royal Blue' },
  { value: '#0e7490', label: 'Teal' },
  { value: '#065f46', label: 'Dark Green' },
  { value: '#7c2d12', label: 'Brown' },
  { value: '#991b1b', label: 'Dark Red' },
  { value: '#4c1d95', label: 'Purple' },
];

const ColorPicker = ({ editor }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const currentColor = editor?.getAttributes('textStyle')?.color || '#000000';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-1.5 flex items-center justify-center rounded text-gray-700 hover:bg-gray-200 transition-colors"
      >
        <Palette size={18} strokeWidth={2} />
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-[3px] rounded-sm" style={{ backgroundColor: currentColor }} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-20 grid grid-cols-4 gap-1 w-[136px]">
          {CV_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              title={c.label}
              onClick={() => {
                editor.chain().focus().setColor(c.value).run();
                setOpen(false);
              }}
              className={`w-7 h-7 rounded-md border-2 transition-transform hover:scale-110 ${
                currentColor === c.value ? 'border-primary ring-1 ring-primary' : 'border-gray-200'
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
          <button
            type="button"
            title="Remove color"
            onClick={() => {
              editor.chain().focus().unsetColor().run();
              setOpen(false);
            }}
            className="w-7 h-7 rounded-md border-2 border-gray-200 hover:scale-110 transition-transform flex items-center justify-center text-gray-400 text-xs bg-white"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

const formatOptions = [
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
];

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const currentFormat = editor.isActive('heading', { level: 1 })
    ? 'h1'
    : editor.isActive('heading', { level: 2 })
      ? 'h2'
      : editor.isActive('heading', { level: 3 })
        ? 'h3'
        : 'paragraph';

  const handleFormatChange = (value) => {
    if (value === 'paragraph') editor.chain().focus().setParagraph().run();
    else if (value === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
    else if (value === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
    else if (value === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
  };

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 p-2 border-b border-neutral-200 bg-white">
      <Select
        value={currentFormat}
        onChange={handleFormatChange}
        options={formatOptions}
        variant="borderless"
        className="w-32"
        popupMatchSelectWidth={false}
      />

      <Divider />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        icon={Bold}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        icon={Italic}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        icon={UnderlineIcon}
      />
      <ColorPicker editor={editor} />

      <Divider />

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
        icon={AlignLeft}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
        icon={AlignCenter}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
        icon={AlignRight}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        isActive={editor.isActive({ textAlign: 'justify' })}
        icon={AlignJustify}
      />

      <Divider />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        icon={List}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        icon={ListOrdered}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
        disabled={!editor.can().sinkListItem('listItem')}
        icon={IndentIncrease}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().liftListItem('listItem').run()}
        disabled={!editor.can().liftListItem('listItem')}
        icon={IndentDecrease}
      />

      <Divider />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
        icon={Code}
      />
    </div>
  );
};

// ── Editor Component ───────────────────────────────────────────────

const ResumeEditor = ({ resumeData }) => {
  const htmlContent = useMemo(() => {
    if (!resumeData) return '';
    return buildResumeHtml(resumeData);
  }, [resumeData]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyleKit,
      EntryHeader,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image,
    ],
    content: htmlContent || '',
    editable: true,
  }, [htmlContent]);

  return (
    <div className="resume-editor flex flex-col h-full">
      <MenuBar editor={editor} />

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
