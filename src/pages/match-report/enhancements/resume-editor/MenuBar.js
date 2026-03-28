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
  Save,
  Check,
  Loader2,
} from 'lucide-react';
import Button from '@/components/Button';
import ColorPicker from './ColorPicker';

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

const formatOptions = [
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
];

const MenuBar = ({ editor, onSave, isSaving, saveStatus }) => {
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
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} />
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} />
      <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={UnderlineIcon} />
      <ColorPicker editor={editor} />

      <Divider />
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} icon={AlignLeft} />
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} icon={AlignCenter} />
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} icon={AlignRight} />
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} icon={AlignJustify} />

      <Divider />
      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={List} />
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={ListOrdered} />
      <ToolbarButton onClick={() => editor.chain().focus().sinkListItem('listItem').run()} disabled={!editor.can().sinkListItem('listItem')} icon={IndentIncrease} />
      <ToolbarButton onClick={() => editor.chain().focus().liftListItem('listItem').run()} disabled={!editor.can().liftListItem('listItem')} icon={IndentDecrease} />

      <Divider />
      <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} icon={Code} />

      <div className="ml-auto flex items-center gap-2">
        {saveStatus && (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Check size={14} /> {saveStatus}
          </span>
        )}
        <Button
          mode="primary"
          size="sm"
          shape="rounded"
          onClick={onSave}
          disabled={isSaving}
          iconLeft={isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default MenuBar;
