import React from "react";

const SuggestModal = ({
  suggestions = [],
  onCancel,
  onConfirm,
  className = "",
  style,
  onMouseEnter,
  onMouseLeave,
}) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div
      className={`flex flex-col rounded-xl border border-neutral-100 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${className}`}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="mb-2 text-sm font-semibold text-neutral-400">
        Suggestion Preview
      </div>
      
      <div className="mb-4 max-h-[250px] overflow-y-auto rounded-lg bg-emerald-50/60 p-4 pb-4">
        <ul className="list-inside list-disc space-y-2 text-sm text-neutral-700">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="leading-relaxed">
              {suggestion}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-neutral-500">
          <button
            type="button"
            className="flex items-center justify-center rounded p-1.5 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            title="Regenerate"
          >
            <span className="material-icons-round text-[18px]">autorenew</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center rounded p-1.5 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            title="Helpful"
          >
            <span className="material-icons-round text-[18px]">thumb_up_off_alt</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center rounded p-1.5 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            title="Not helpful"
          >
            <span className="material-icons-round text-[18px]">thumb_down_off_alt</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-neutral-600 transition-colors hover:bg-neutral-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold flex items-center justify-center text-white transition-colors hover:bg-orange-600"
          >
            Mark as fixed
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestModal;
