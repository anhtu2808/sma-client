import React from "react";
import { getParseStatusView, normalizeParseStatus } from "@/constant/attachment";

const ResumeOption = ({ resume, isSelected, isSelectable, isPartial, isParsing, onSelect, onParse }) => {
  const status = normalizeParseStatus(resume?.parseStatus);
  const statusView = getParseStatusView(status, false);
  const isWaiting = status === "WAITING";
  const isParseBusy = isParsing || isPartial;

  const cardClassName = isSelected
    ? "border-2 border-primary bg-orange-50/40"
    : isSelectable
    ? "border border-gray-200 bg-white hover:border-primary"
    : "border border-gray-200 bg-gray-50/80 opacity-80";

  return (
    <div
      className={`rounded-xl p-5 transition-all ${cardClassName}`}
      role="button"
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
        </div>

        <div className="flex w-[112px] shrink-0 items-center justify-end">
          {isSelectable ? (
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
