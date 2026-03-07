const SuggestionCard = ({ text }) => {
  return (
    <div className="cursor-pointer rounded border border-neutral-200 bg-white p-3 text-sm leading-relaxed text-neutral-700 shadow-sm transition-shadow hover:shadow">
      {text}
    </div>
  );
};

export default SuggestionCard;
