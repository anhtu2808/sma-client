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
  const isApplied = useMemo(
    () =>
      idsToMark.length > 0 &&
      idsToMark.every((id) =>
        matchData?.criteriaScores
          ?.flatMap((criteria) => criteria.details || [])
          .some((detail) => detail.id === id && detail.isFixed)
      ),
    [idsToMark, matchData?.criteriaScores]
  );

  // Strip HTML tags to get plain text for clipboard
  const getPlainText = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  // Highlight user-owned placeholders like [project name] so candidates know to self-fill them.
  // Regex avoids matching inside HTML tag attributes (excludes < and >).
  const PLACEHOLDER_HINT =
    "Đây là chỗ bạn cần tự điền bằng thông tin thật của mình (tên dự án, vai trò, số liệu…) trước khi dùng.";
  const decorated = useMemo(() => {
    if (!text) return "";
    return text.replace(
      /\[([^\]<>]{1,80})\]/g,
      (_m, inner) =>
        `<span class="inline-block rounded bg-amber-100 px-1 text-amber-800 border border-amber-300" title="${PLACEHOLDER_HINT}">[${inner}]</span>`
    );
  }, [text]);
  const hasPlaceholder = /\[[^\]<>]{1,80}\]/.test(text || "");

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
        <div className="min-w-0 flex-1 prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5" dangerouslySetInnerHTML={{ __html: decorated }} />

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

      {hasPlaceholder && (
        <div className="mt-2 rounded bg-amber-50 px-2 py-1 text-[11px] text-amber-800">
          {PLACEHOLDER_HINT}
        </div>
      )}

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
