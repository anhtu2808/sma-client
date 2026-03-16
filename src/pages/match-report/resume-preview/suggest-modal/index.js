import React from "react";

const SuggestModal = ({
  status,
  isFixed,
  description,
  suggestions = [],
  onCancel,
  onConfirm,
  onRegenerateSuggestion,
  regeneratingSuggestionId = null,
  isMarkingFixed = false,
  className = "",
  style,
  onMouseEnter,
  onMouseLeave,
}) => {
  if ((!suggestions || suggestions.length === 0) && !description) return null;

  const isDone = status === "MATCHED" || isFixed;

  return (
    <div
      className={`flex flex-col rounded-xl border border-neutral-100 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${className}`}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="mb-2 text-sm font-semibold text-neutral-400">
        AI Evaluation Detail
      </div>

      {description && (
        <div className="mb-3 text-sm leading-relaxed text-neutral-700">
          {description}
        </div>
      )}
      
      {suggestions.length > 0 && (
        <div className="mb-4 max-h-[250px] overflow-y-auto rounded-lg bg-emerald-50/60 p-4 pb-4">
          <ul className="space-y-3 text-sm text-neutral-700">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion?.id ?? index}
                className="rounded-lg bg-white/80 p-3 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1 leading-relaxed">
                    {suggestion?.suggestion}
                  </div>

                  {!isDone ? (
                    <button
                      type="button"
                      aria-label="Regenerate suggestion"
                      title="Uses 1 suggestion credit"
                      disabled={
                        regeneratingSuggestionId === suggestion?.id
                        || !Number.isFinite(Number(suggestion?.id))
                      }
                      onClick={() => onRegenerateSuggestion?.(suggestion?.id)}
                      className="flex shrink-0 items-center justify-center rounded p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span
                        className={`material-icons-round text-[18px] ${
                          regeneratingSuggestionId === suggestion?.id ? "animate-spin" : ""
                        }`}
                      >
                        autorenew
                      </span>
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div />

        {!isDone && (
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
              disabled={isMarkingFixed}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold flex items-center justify-center text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isMarkingFixed ? "Marking..." : "Mark as fixed"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestModal;
