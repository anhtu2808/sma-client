import React from "react";
import dayjs from "dayjs";
import { getParseStatusView, normalizeParseStatus } from "@/constant/attachment";
import { getEvaluationHistoryId, getEvaluationHistoryScore } from "./matchHistory";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '../../../utils/icons';
import { Sparkles } from 'lucide-react';

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
  const evaluationHistoryId = getEvaluationHistoryId(resume);
  const evaluationHistoryScore = getEvaluationHistoryScore(resume);
  const hasEvaluationHistory = evaluationHistoryId != null;

  const cardClassName = isSelected
    ? "border-2 border-primary bg-orange-50/40"
    : hasEvaluationHistory
    ? "border-2 border-amber-200 bg-amber-50/40"
    : isSelectable
    ? "border-2 border-gray-200 bg-white hover:border-primary"
    : "border-2 border-gray-200 bg-gray-50/80 opacity-80";

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
            {hasEvaluationHistory && (
              <span className="inline-flex items-center rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                Matched before
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
            <span
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-medium ${statusView.className}`}
            >
              {statusView.label}
            </span>
            {!hasEvaluationHistory && (
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
            {hasEvaluationHistory && evaluationHistoryScore != null && (
              <span className="inline-flex items-center gap-1 rounded-md border-2 border-emerald-400 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-md bg-emerald-400" />
                {evaluationHistoryScore}%
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2">
          {hasEvaluationHistory ? (
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
          ) : isSelectable ? (
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
                disabled={!isSelectable}
                onChange={() => isSelectable && onSelect(resume.id)}
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
          ) : (
            <span className="text-xs text-gray-400">Processing...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeOption;
