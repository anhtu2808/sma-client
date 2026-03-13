import SuggestionCard from "./SuggestionCard";

const Suggestions = ({ itemKey, suggestions, isFocused }) => {
  return (
    <div className={`space-y-3 px-4 pb-4 pl-11 pt-2 ${isFocused ? "bg-transparent" : "bg-white"}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[13.5px] font-semibold text-neutral-800">
          <span className="material-icons-round text-[16px] text-primary">
            auto_awesome
          </span>
          Phrase suggestions
        </div>
        
        <button
          type="button"
          title="Regenerate"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Hook up API call
          }}
          className="flex items-center justify-center rounded p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <span className="material-icons-round text-[18px]">autorenew</span>
        </button>
      </div>
      {suggestions.map((suggestion, index) => (
        <SuggestionCard key={`${itemKey}-${index}`} text={suggestion} />
      ))}
    </div>
  );
};

export default Suggestions;
