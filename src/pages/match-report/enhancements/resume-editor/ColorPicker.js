import { useEffect, useRef, useState } from 'react';
import { Palette } from 'lucide-react';

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
        <div
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-[3px] rounded-sm"
          style={{ backgroundColor: currentColor }}
        />
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

export default ColorPicker;
