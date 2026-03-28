import SuggestionCard from "./SuggestionCard";

const Suggestions = ({
  itemKey,
  suggestions,
  isFocused,
  canRegenerate = true,
  regeneratingSuggestionId = null,
  onRegenerateSuggestion,
  context = null,
  detailId = null,
}) => {
  return (
    <div className={`space-y-3 px-4 pb-4 pl-11 pt-2 ${isFocused ? "bg-transparent" : "bg-white"}`}>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 text-[13.5px] font-semibold text-neutral-800">
          <span className="material-icons-round text-[16px] text-primary">
            auto_awesome
          </span>
          Phrase suggestions
        </div>
      </div>

      {suggestions.map((suggestion, index) => (
        <SuggestionCard
          key={`${itemKey}-${suggestion?.id ?? index}`}
          suggestion={suggestion}
          canRegenerate={canRegenerate}
          isRegenerating={regeneratingSuggestionId === suggestion?.id}
          onRegenerate={onRegenerateSuggestion}
          context={context}
          detailId={detailId}
        />
      ))}
    </div>
  );
};

export default Suggestions;
