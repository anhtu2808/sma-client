import { useSelector } from "react-redux";
import ScoreCard from "./ScoreCard";

const SidebarHeader = () => {
  const matchData = useSelector((state) => state.matchingReport.data);
  const score = Number.isFinite(matchData?.aiOverallScore) ? matchData.aiOverallScore : 0;
  const title = matchData?.jobName || "Matching report";
  const subtitle = matchData?.resumeFullName || matchData?.candidateName || "Candidate";

  return (
    <div className="flex flex-col border-b border-neutral-200 bg-white">
      {/* Main Header Info */}
      <div className="flex items-center gap-4 p-5 pb-3">
        <ScoreCard score={score} />

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="text-base font-bold text-neutral-900 truncate">{title}</div>
          <div className="text-[13px] font-medium text-neutral-500">{subtitle}</div>
        </div>
      </div>

      <div className="px-5 pb-4">
        <div className="flex items-start gap-2.5 rounded-xl bg-amber-50/70 p-3 border border-amber-100">
          <div className="text-amber-500 mt-0.5 shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-800 italic font-medium">
            <b>Note:</b> AI parsing may contain inaccuracies. Please double-check the content manually for the most accurate evaluation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SidebarHeader;
