import React from "react";
import { getParseStatusView, normalizeParseStatus } from "@/constant/attachment";

const ResumeOption = ({
  resume,
  isSelected,
  isSelectable,
  isPolling,
  isParsing,
  onSelect,
  onParse,
}) => {
  const status = normalizeParseStatus(resume?.parseStatus);
  const statusView = getParseStatusView(status, isPolling);

  const cardClassName = isSelected
    ? "border-2 border-primary bg-orange-50/40"
    : isSelectable
    ? "border border-gray-200 bg-white hover:border-primary"
    : "border border-gray-200 bg-gray-50";

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
      <div className="flex items-start justify-between gap-4">
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
              {(isPolling || status === "PARTIAL") && (
                <i className="material-icons-round animate-spin text-[12px] leading-none">autorenew</i>
              )}
              {statusView.label}
            </span>
            <span className="text-gray-400">•</span>
            <span>{resume.fileName || "No file name"}</span>
          </div>

          {!isSelectable && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-700">
                <i className="material-icons-round text-[14px]">warning</i>
                Parsing required
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
                disabled={isParsing || isPolling || status === "PARTIAL"}
                onClick={(event) => {
                  event.stopPropagation();
                  onParse(resume.id);
                }}
              >
                <i className="material-icons-round text-[14px]">psychology</i>
                {isParsing || isPolling || status === "PARTIAL" ? "Parsing..." : "Parse CV"}
              </button>
            </div>
          )}
        </div>

        <div className="flex h-6 w-6 items-center justify-center pt-1">
          <input
            type="radio"
            checked={isSelected}
            disabled={!isSelectable}
            onChange={() => isSelectable && onSelect(resume.id)}
            className="h-5 w-5 cursor-pointer border-gray-300 text-primary focus:ring-primary disabled:cursor-not-allowed"
            aria-label={`Select resume ${resume.resumeName || resume.fileName || resume.id}`}
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeOption;
