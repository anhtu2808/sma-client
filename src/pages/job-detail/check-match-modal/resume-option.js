import React from "react";
import { getParseStatusView, normalizeParseStatus } from "@/constant/attachment";
import { getEvaluationHistoryId, getEvaluationHistoryScore } from "./matchHistory";

const ResumeOption = ({
  resume,
  isSelected,
  isSelectable,
  isPartial,
  isParsing,
  onSelect,
  onParse,
  onViewHistory,
}) => {
  const status = normalizeParseStatus(resume?.parseStatus);
  const statusView = getParseStatusView(status, false);
  const isWaiting = status === "WAITING";
  const isParseBusy = isParsing || isPartial;
  const evaluationHistoryId = getEvaluationHistoryId(resume);
  const evaluationHistoryScore = getEvaluationHistoryScore(resume);
  const hasEvaluationHistory = evaluationHistoryId != null;

  const cardClassName = isSelected
    ? "border-2 border-primary bg-orange-50/40"
    : hasEvaluationHistory
    ? "border border-amber-200 bg-amber-50/40"
    : isSelectable
    ? "border border-gray-200 bg-white hover:border-primary"
    : "border border-gray-200 bg-gray-50/80 opacity-80";

  return (
    <div
      className={`rounded-xl p-5 transition-all ${cardClassName}`}
      role={isSelectable ? "button" : undefined}
      tabIndex={isSelectable ? 0 : -1}
      onClick={() => isSelectable && onSelect(resume.id)}
      onKeyDown={(event) => {
        if (!isSelectable) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(resume.id);
        }
      }}
    >
      <div className="flex h-full items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-semibold text-gray-900 truncate">
              {resume.resumeName || resume.fileName || `Resume #${resume.id}`}
            </h4>
            {resume.type === "PROFILE" && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                Built-in
              </span>
            )}
            {hasEvaluationHistory && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                Matched before
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-medium ${statusView.className}`}
            >
              {statusView.label}
            </span>
            <span className="text-gray-400">•</span>
            <span>{resume.fileName || "No file name"}</span>
          </div>

          {hasEvaluationHistory && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              {evaluationHistoryScore != null && (
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
                  Previous score: {evaluationHistoryScore}%
                </span>
              )}
              <span className="text-amber-700">
                This resume already has a saved match result for this job.
              </span>
            </div>
          )}
        </div>

        <div className="flex w-[112px] shrink-0 items-center justify-end">
          {hasEvaluationHistory ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onViewHistory?.(resume);
              }}
              className="inline-flex h-9 items-center justify-center rounded-md border border-amber-200 bg-white px-3 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-50"
            >
              View score
            </button>
          ) : isSelectable ? (
            <input
              type="radio"
              checked={isSelected}
              disabled={!isSelectable}
              onChange={() => isSelectable && onSelect(resume.id)}
              className="h-5 w-5 cursor-pointer border-gray-300 focus:ring-primary disabled:cursor-not-allowed"
              style={{ accentColor: "#ff5722" }}
              aria-label={`Select resume ${resume.resumeName || resume.fileName || resume.id}`}
            />
          ) : isWaiting ? (
            <button
              type="button"
              className="inline-flex h-9 w-[108px] items-center justify-center gap-1 rounded-md bg-primary px-3 text-xs font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isParseBusy}
              onClick={(event) => {
                event.stopPropagation();
                onParse(resume.id);
              }}
            >
              <i className="material-icons-round text-[14px]">psychology</i>
              Parse CV
            </button>
          ) : (
            <span className="text-xs text-gray-400">Processing...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeOption;
