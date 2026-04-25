import React from "react";
import dayjs from "dayjs";
import { getParseStatusView, normalizeParseStatus } from "@/constant/attachment";
import {
  getEvaluationHistoryScore,
  getEvaluationHistoryStatus,
  getResumeMatchMode,
} from "./matchHistory";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '../../../utils/icons';
import { Sparkles } from 'lucide-react';
import { formatScore } from '@/utils/formatScore';

const ResumeOption = ({
  resume,
  isSelected,
  isSelectable,
  isPartial,
  isParsing,
  onSelect,
  onParse,
  onViewHistory,
  onDelete,
}) => {
  const status = normalizeParseStatus(resume?.parseStatus);
  const statusView = getParseStatusView(status, false);
  const isWaiting = status === "WAITING";
  const isParseBusy = isParsing || isPartial;
  const evaluationHistoryScore = getEvaluationHistoryScore(resume);
  const evaluationStatus = getEvaluationHistoryStatus(resume);
  const matchMode = getResumeMatchMode(resume);
  const hasFinishedScore = matchMode === "existing";
  const canRetryScore = matchMode === "retry";
  const isScoreProcessing = matchMode === "processing";
  const canSelect = isSelectable || canRetryScore;

  const scoreStatusView = (() => {
    switch (evaluationStatus) {
      case "FINISH":
        return { label: "Scored", className: "bg-amber-100 text-amber-700" };
      case "FAIL":
        return { label: "Score failed", className: "bg-red-100 text-red-700" };
      case "WAITING":
      case "PARTIAL":
        return { label: "Scoring", className: "bg-sky-100 text-sky-700" };
      default:
        return null;
    }
  })();

  const cardClassName = isSelected
    ? "border-2 border-primary bg-orange-50/40"
    : hasFinishedScore
    ? "border-2 border-amber-200 bg-amber-50/40"
    : canRetryScore
    ? "border-2 border-red-200 bg-red-50/40 hover:border-primary"
    : isScoreProcessing
    ? "border-2 border-sky-200 bg-sky-50/40"
    : isSelectable
    ? "border-2 border-gray-200 bg-white hover:border-primary"
    : "border-2 border-gray-200 bg-gray-50/80 opacity-80";

  return (
    <div
      className={`rounded-xl p-5 transition-all ${cardClassName}`}
      role={canSelect ? "button" : undefined}
      tabIndex={canSelect ? 0 : -1}
      onClick={() => canSelect && onSelect(resume.id)}
      onKeyDown={(event) => {
        if (!canSelect) return;
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
            {scoreStatusView && (
              <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${scoreStatusView.className}`}>
                {scoreStatusView.label}
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
            <span
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-medium ${statusView.className}`}
            >
              {statusView.label}
            </span>
            {!hasFinishedScore && !isScoreProcessing && !canRetryScore && (
              <>
                <span className="text-gray-400">•</span>
                <span>{resume.fileName || "No file name"}</span>
              </>
            )}
            {resume.createdAt && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">{dayjs(resume.createdAt).format("DD/MM/YYYY")}</span>
              </>
            )}
            {hasFinishedScore && evaluationHistoryScore != null && (
              <span className="inline-flex items-center gap-1 rounded-md border-2 border-emerald-400 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-md bg-emerald-400" />
                {formatScore(evaluationHistoryScore, 2)}%
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2">
          {hasFinishedScore ? (
            <>
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
              {onDelete && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(resume.id);
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  aria-label="Delete resume"
                >
                  <FontAwesomeIcon icon={faTrashCan} className="text-[18px]" />
                </button>
              )}
            </>
          ) : canSelect ? (
            <>
              {onDelete && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(resume.id);
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  aria-label="Delete resume"
                >
                  <FontAwesomeIcon icon={faTrashCan} className="text-[18px]" />
                </button>
              )}
              <input
                type="radio"
                checked={isSelected}
                disabled={!canSelect}
                onChange={() => canSelect && onSelect(resume.id)}
                className="h-5 w-5 cursor-pointer border-gray-300 focus:ring-primary disabled:cursor-not-allowed"
                style={{ accentColor: "#ff5722" }}
                aria-label={`Select resume ${resume.resumeName || resume.fileName || resume.id}`}
              />
            </>
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
              <Sparkles size={14} />
              Parse CV
            </button>
          ) : isScoreProcessing ? (
            <span className="text-xs font-medium text-sky-600">Scoring...</span>
          ) : (
            <span className="text-xs text-gray-400">Processing...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeOption;
