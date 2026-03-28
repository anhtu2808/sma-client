import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import {
  setDetailFixed,
  updateScoresAfterFixed,
} from "@/store/slices/matchingReportSlice";
import { useMarkDetailAsFixedMutation } from "@/apis/matchingApi";
import { getErrorMessage } from "@/constant/attachment";
import toastMessage from "@/utils/toastMessage";
import EditorContext from "@/pages/match-report/enhancements/EditorContext";

const SuggestionCard = ({
  suggestion,
  canRegenerate = true,
  isRegenerating = false,
  onRegenerate,
  context = null,
  detailId = null,
}) => {
  const dispatch = useDispatch();
  const [copied, setCopied] = useState(false);
  const [fixApplied, setFixApplied] = useState(false);
  const { fixInEditor, fixingDetailId } = useContext(EditorContext);
  const [markDetailAsFixed] = useMarkDetailAsFixedMutation();
  const text = suggestion?.suggestion || "";

  const canFixInEditor = !!fixInEditor && !!context && !!text;
  const isFixingThis = fixingDetailId === detailId;

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

  const handleFixInEditor = async (event) => {
    event.stopPropagation();
    if (!canFixInEditor || isFixingThis || fixApplied) return;

    const success = await fixInEditor(context, text, detailId);
    if (!success) return;

    setFixApplied(true);

    // Mark as fixed via API
    try {
      const response = await markDetailAsFixed({ detailId }).unwrap();
      dispatch(setDetailFixed({ detailId }));

      if (response) {
        dispatch(
          updateScoresAfterFixed({
            afterOverallScore: response.afterOverallScore,
            criteriaScoreId: response.criteriaScoreId,
            afterCriteriaScore: response.afterCriteriaScore,
          })
        );
      }

      toastMessage.success("Fix applied successfully.");
    } catch (error) {
      toastMessage.error(
        getErrorMessage(error, "Fix applied but failed to update status.")
      );
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

        <div className="flex shrink-0 items-center gap-1">
          {canFixInEditor ? (
            <button
              type="button"
              aria-label="Fix in editor"
              title="Replace text in editor"
              disabled={isFixingThis || fixApplied || !!fixingDetailId}
              onClick={handleFixInEditor}
              className="flex shrink-0 items-center justify-center rounded p-1 text-neutral-500 transition-colors hover:bg-amber-50 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span
                className={`material-icons-round text-[18px] ${
                  isFixingThis ? "animate-spin" : ""
                } ${fixApplied ? "text-emerald-500" : ""}`}
              >
                {isFixingThis
                  ? "autorenew"
                  : fixApplied
                  ? "check_circle"
                  : "auto_fix_high"}
              </span>
            </button>
          ) : null}

          {canRegenerate ? (
            <button
              type="button"
              aria-label="Regenerate suggestion"
              title="Uses 1 suggestion credit"
              disabled={
                isRegenerating || !Number.isFinite(Number(suggestion?.id))
              }
              onClick={(event) => {
                event.stopPropagation();
                onRegenerate?.(suggestion?.id);
              }}
              className="flex shrink-0 items-center justify-center rounded p-1 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span
                className={`material-icons-round text-[18px] ${
                  isRegenerating ? "animate-spin" : ""
                }`}
              >
                autorenew
              </span>
            </button>
          ) : null}
        </div>
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
