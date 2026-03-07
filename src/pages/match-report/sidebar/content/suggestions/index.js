import SuggestionCard from "./SuggestionCard";

const Suggestions = ({ itemKey, suggestions }) => {
  return (
    <div className="space-y-2 border-t border-neutral-200 bg-white p-3">
      <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-neutral-900">
        <span className="material-icons-round text-[16px] text-primary">
          auto_awesome
        </span>
        Phrase suggestions
      </div>
      {suggestions.map((suggestion, index) => (
        <SuggestionCard key={`${itemKey}-${index}`} text={suggestion} />
      ))}
    </div>
  );
};

export default Suggestions;
