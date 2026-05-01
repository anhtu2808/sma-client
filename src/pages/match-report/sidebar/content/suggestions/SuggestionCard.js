import { useContext, useMemo, useState } from "react";
import { Tooltip } from "antd";
import { useSelector } from "react-redux";
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
  const [copied, setCopied] = useState(false);
  const { applySuggestion, fixInEditor, fixingDetailId, editor } = useContext(EditorContext);
  const text = suggestion?.suggestion || "";
  const matchData = useSelector((state) => state.matchingReport.data);
  const idsToMark = useMemo(
    () => (Array.isArray(allDetailIds) && allDetailIds.length > 0 ? allDetailIds : detailId != null ? [detailId] : []),
    [allDetailIds, detailId]
  );

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
  const isApplied = useMemo(() => {
    if (suggestion?.isApplied) return true;
    if (suggestion?.id == null) return false;
    const allDetails = matchData?.criteriaScores?.flatMap((criteria) => criteria.details || []) ?? [];
    let ownerDetail = null;
    for (const detail of allDetails) {
      const found = detail.suggestions?.find((s) => s.id === suggestion.id);
      if (found) {
        if (found.isApplied) return true;
        ownerDetail = detail;
        break;
      }
    }
    // Backend persists only detail.isFixed — restore-from-reload fallback.
    if (ownerDetail?.isFixed) {
      const anyMarked = ownerDetail.suggestions?.some((s) => s.isApplied);
      if (!anyMarked) return true;
    }
    return false;
  }, [suggestion?.id, suggestion?.isApplied, matchData?.criteriaScores]);

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
    if (!canFixInEditor || isFixingThis || isApplied || !applySuggestion) return;

    await applySuggestion({
      detailId,
      suggestionId: suggestion?.id,
      context,
      suggestionText: text,
      detailIds: idsToMark,
    });
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
        <div className="min-w-0 flex-1 prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5" dangerouslySetInnerHTML={{ __html: text }} />

        <div className="flex shrink-0 items-center gap-1">
          {canFixInEditor ? (
            <Tooltip title="Apply suggestion to editor" placement="top">
              <button
                type="button"
                aria-label="Apply suggestion to editor"
                disabled={isFixingThis || isApplied || !!fixingDetailId}
                onClick={handleFixInEditor}
                className="flex shrink-0 items-center justify-center rounded p-1 text-neutral-500 transition-colors hover:bg-amber-50 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FontAwesomeIcon
                  icon={isFixingThis ? faArrowsRotate : isApplied ? faCircleCheck : faWandMagicSparkles}
                  className={`text-[18px] ${
                    isFixingThis ? "animate-spin" : ""
                  } ${isApplied ? "text-emerald-500" : ""}`}
                />
              </button>
            </Tooltip>
          ) : null}

          {canRegenerate ? (
            <Tooltip title="Regenerate suggestion (uses 1 credit)" placement="top">
              <button
                type="button"
                aria-label="Regenerate suggestion"
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
            </Tooltip>
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
