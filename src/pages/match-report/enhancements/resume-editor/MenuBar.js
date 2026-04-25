import { Select, Tooltip } from 'antd';
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
  Code,
  Save,
  Loader2,
  RefreshCw,
  FileCheck,
  History,
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft, faRotateRight } from '../../../../utils/icons';
import ColorPicker from './ColorPicker';

const ToolbarButton = ({ onClick, isActive, icon: Icon, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`p-1.5 flex items-center justify-center rounded text-gray-700 hover:bg-gray-200 transition-colors shrink-0
      ${isActive ? 'bg-gray-200 text-black' : ''}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
  </button>
);

const Divider = () => <div className="w-px h-6 bg-gray-300 mx-1 shrink-0" />;

const formatOptions = [
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
];

const MenuBar = ({
  editor,
  onSave,
  isSaving,
  saveStatus,
  onUndo,
  onRedo,
  canBackendUndo,
  canBackendRedo,
  isBackendUndoing,
  isBackendRedoing,
  onOpenHistory,
  onReScore,
  isReScoring,
  reScoreStatus,
  onExport,
  isExporting,
}) => {
  if (!editor) return null;

  const isReScoreBusy =
    isReScoring ||
    reScoreStatus === 'polling' ||
    reScoreStatus === 'regenerating-suggestions';

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

  const isExportDisabled =
    !editor || isSaving || isExporting || reScoreStatus === 'polling';

  return (
    <div className="sticky top-0 z-10 flex flex-nowrap items-center gap-1 p-2 border-b border-neutral-200 bg-white">
      {/* Left zone: formatting tools — scrolls horizontally if overflow */}
      <div className="flex flex-nowrap items-center gap-1 min-w-0 flex-1 overflow-x-auto">
        <Tooltip title="Undo">
          <button
            type="button"
            onClick={onUndo || (() => editor.chain().focus().undo().run())}
            disabled={isBackendUndoing || (!editor.can().undo() && !canBackendUndo)}
            className="p-1.5 flex items-center justify-center rounded text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isBackendUndoing ? <Loader2 size={16} className="animate-spin" /> : <FontAwesomeIcon icon={faRotateLeft} className="text-[16px]" />}
          </button>
        </Tooltip>
        <Tooltip title="Redo">
          <button
            type="button"
            onClick={onRedo || (() => editor.chain().focus().redo().run())}
            disabled={isBackendRedoing || (!editor.can().redo() && !canBackendRedo)}
            className="p-1.5 flex items-center justify-center rounded text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isBackendRedoing ? <Loader2 size={16} className="animate-spin" /> : <FontAwesomeIcon icon={faRotateRight} className="text-[16px]" />}
          </button>
        </Tooltip>

        <Divider />

        <Select
          value={currentFormat}
          onChange={handleFormatChange}
          options={formatOptions}
          variant="borderless"
          className="w-32 shrink-0"
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

        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} icon={Code} />
      </div>

      {/* Right zone: actions — always visible, never shrinks */}
      <div className="flex items-center gap-1.5 shrink-0 pl-2 ml-1 border-l border-neutral-200">
        {onReScore && (
          <Tooltip
            title={
              reScoreStatus === 'polling'
                ? 'Re-scoring...'
                : reScoreStatus === 'regenerating-suggestions'
                  ? 'Updating suggestions...'
                  : 'Re-score'
            }
          >
            <button
              type="button"
              onClick={onReScore}
              disabled={isReScoreBusy}
              className="flex items-center justify-center rounded-lg w-9 h-9 text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-sm"
            >
              <RefreshCw
                size={16}
                className={isReScoreBusy ? 'animate-spin' : ''}
              />
            </button>
          </Tooltip>
        )}
        {onOpenHistory && (
          <Tooltip title="Version history">
            <button
              type="button"
              onClick={onOpenHistory}
              className="flex items-center justify-center rounded-lg w-9 h-9 text-gray-700 transition-all bg-gray-100 hover:bg-gray-200 shadow-sm"
            >
              <History size={16} />
            </button>
          </Tooltip>
        )}
        <Tooltip title="Save (Ctrl/Cmd + S)">
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center justify-center rounded-lg w-9 h-9 text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed bg-primary hover:bg-primary-dark shadow-sm"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          </button>
        </Tooltip>
        {onExport && (
          <Tooltip title="Use this CV to Apply">
            <button
              type="button"
              onClick={onExport}
              disabled={isExportDisabled}
              className="flex items-center gap-1.5 rounded-lg h-9 px-3.5 text-xs font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-sm"
            >
              {isExporting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <FileCheck size={16} />
              )}
              <span className="hidden lg:inline">Use this CV to Apply</span>
              <span className="hidden md:inline lg:hidden">Apply</span>
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default MenuBar;
