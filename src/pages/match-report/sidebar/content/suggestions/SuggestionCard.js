import { useContext, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setDetailContext,
  setDetailFixed,
  setFocusedItemId,
  updateScoresAfterFixed,
} from "@/store/slices/matchingReportSlice";
import { useMarkDetailAsFixedMutation } from "@/apis/matchingApi";
import { getErrorMessage } from "@/constant/attachment";
import toastMessage from "@/utils/toastMessage";
import EditorContext from "@/pages/match-report/enhancements/EditorContext";
import { findTextInDoc } from "@/pages/match-report/enhancements/resume-editor/utils/prosemirrorSearch";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faCheck, faCircleCheck, faWandMagicSparkles } from '../../../../../utils/icons';

const SuggestionCard = ({
  suggestion,
  canRegenerate = true,
  isRegenerating = false,
  onRegenerate,
  context = null,
  detailId = null,
  allDetailIds = null,
}) => {
  const dispatch = useDispatch();
  const [copied, setCopied] = useState(false);
  const [fixApplied, setFixApplied] = useState(false);
  const { fixInEditor, fixingDetailId, editor, pushFixUndo } = useContext(EditorContext);
  const [markDetailAsFixed] = useMarkDetailAsFixedMutation();
  const text = suggestion?.suggestion || "";

  // Capture current scores for undo purposes (before applying fix)
  const matchData = useSelector((state) => state.matchingReport.data);

  // Check if context text is findable in the editor document
  const isTextFoundInEditor = useMemo(() => {
    if (!editor || !context || editor.isDestroyed) return false;
    try {
      return findTextInDoc(editor.state.doc, context).length > 0;
    } catch {
      return false;
    }
  }, [editor, context, editor?.state?.doc]);

  const canFixInEditor = !!fixInEditor && !!context && !!text && isTextFoundInEditor;
  const isFixingThis = fixingDetailId === detailId;

  // Strip HTML tags to get plain text for clipboard
  const getPlainText = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const handleCopy = async () => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(getPlainText(text));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleFixInEditor = async (event) => {
    event.stopPropagation();
    if (!canFixInEditor || isFixingThis || fixApplied) return;

    // Capture pre-fix state for undo
    const beforeDoc = editor?.state?.doc;
    const beforeOverallScore = matchData?.aiOverallScore;

    const success = await fixInEditor(context, text, detailId);
    if (!success) return;

    setFixApplied(true);

    // Update context to the new text so the decoration can find it in the doc
    dispatch(setDetailContext({ detailId, context: text }));

    // Mark as fixed via API — handle both single detail and context group
    const idsToMark = allDetailIds ?? [detailId];
    let criteriaScoreId;
    let beforeCriteriaScore;

    try {
      for (const id of idsToMark) {
        const response = await markDetailAsFixed({ detailId: id }).unwrap();
        dispatch(setDetailFixed({ detailId: id }));

        if (response) {
          criteriaScoreId = response.criteriaScoreId;
          // Before score = after minus impact (reverse the markAsFixed calculation)
          if (beforeCriteriaScore === undefined && matchData?.criteriaScores) {
            const cs = matchData.criteriaScores.find((c) => c.id === response.criteriaScoreId);
            beforeCriteriaScore = cs?.aiScore;
          }
          dispatch(
            updateScoresAfterFixed({
              afterOverallScore: response.afterOverallScore,
              criteriaScoreId: response.criteriaScoreId,
              afterCriteriaScore: response.afterCriteriaScore,
            })
          );
        }
      }

      // Register this fix in the undo stack so Ctrl+Z can roll it back
      if (beforeDoc && pushFixUndo) {
        pushFixUndo({
          beforeDoc,
          detailIds: idsToMark,
          criteriaScoreId,
          beforeOverallScore,
          beforeCriteriaScore,
          originalContext: context,
        });
      }

      toastMessage.success("Fix applied successfully.");
      dispatch(setFocusedItemId(detailId));
      setTimeout(() => dispatch(setFocusedItemId(null)), 2500);
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
          : "border-neutral-200 text-neutral-900"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: text }} />

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
              <FontAwesomeIcon
                icon={isFixingThis ? faArrowsRotate : fixApplied ? faCircleCheck : faWandMagicSparkles}
                className={`text-[18px] ${
                  isFixingThis ? "animate-spin" : ""
                } ${fixApplied ? "text-emerald-500" : ""}`}
              />
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
              <FontAwesomeIcon
                icon={faArrowsRotate}
                className={`text-[18px] ${
                  isRegenerating ? "animate-spin" : ""
                }`}
              />
            </button>
          ) : null}
        </div>
      </div>

      {copied && (
        <div className="absolute bottom-0 right-0 flex items-center gap-0.5 rounded-tl-md bg-emerald-500 px-2 py-1 text-[10px] font-medium text-white animate-in fade-in zoom-in duration-200">
          <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
          <span>Copied</span>
        </div>
      )}
    </div>
  );
};

export default SuggestionCard;
