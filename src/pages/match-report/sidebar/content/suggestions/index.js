import SuggestionCard from "./SuggestionCard";

const Suggestions = ({ itemKey, suggestions, isFixed, onToggleFixed }) => {
  return (
    <div className="space-y-2 border-t border-neutral-200 bg-white p-3">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
          <span className="material-icons-round text-[16px] text-primary">
            auto_awesome
          </span>
          Phrase suggestions
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFixed?.();
          }}
          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold transition-all ring-1 ring-inset ${
            isFixed
              ? "bg-emerald-50 text-emerald-600 ring-emerald-600/20"
              : "bg-white text-neutral-500 ring-neutral-200 hover:bg-neutral-50 hover:text-neutral-900"
          }`}
        >
          <span className="material-icons-round text-sm">
            {isFixed ? "check_circle" : "check_circle_outline"}
          </span>
          {isFixed ? "Fixed" : "Mark as fixed"}
        </button>
      </div>
      {suggestions.map((suggestion, index) => (
        <SuggestionCard key={`${itemKey}-${index}`} text={suggestion} />
      ))}
    </div>
  );
};

export default Suggestions;
