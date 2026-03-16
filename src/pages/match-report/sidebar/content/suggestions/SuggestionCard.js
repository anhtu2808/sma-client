import { useState } from "react";

const SuggestionCard = ({
  suggestion,
  canRegenerate = true,
  isRegenerating = false,
  onRegenerate,
}) => {
  const [copied, setCopied] = useState(false);
  const text = suggestion?.suggestion || "";

  const handleCopy = async () => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      onClick={handleCopy}
      className={`relative cursor-pointer overflow-hidden rounded border bg-white p-3 text-sm leading-relaxed shadow-sm transition-all hover:shadow ${
        copied
          ? "border-emerald-500 text-emerald-700"
          : "border-neutral-200 text-neutral-700"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">{text}</div>

        {canRegenerate ? (
          <button
            type="button"
            aria-label="Regenerate suggestion"
            title="Uses 1 suggestion credit"
            disabled={isRegenerating || !Number.isFinite(Number(suggestion?.id))}
            onClick={(event) => {
              event.stopPropagation();
              onRegenerate?.(suggestion?.id);
            }}
            className="flex shrink-0 items-center justify-center rounded p-1 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span
              className={`material-icons-round text-[18px] ${isRegenerating ? "animate-spin" : ""}`}
            >
              autorenew
            </span>
          </button>
        ) : null}
      </div>

      {copied && (
        <div className="absolute bottom-0 right-0 flex items-center gap-0.5 rounded-tl-md bg-emerald-500 px-2 py-1 text-[10px] font-medium text-white animate-in fade-in zoom-in duration-200">
          <span className="material-icons-round text-[10px]">check</span>
          <span>Copied</span>
        </div>
      )}
    </div>
  );
};

export default SuggestionCard;
