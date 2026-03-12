import { useSelector } from "react-redux";
import ScoreCard from "./ScoreCard";

const SidebarHeader = () => {
  const matchData = useSelector((state) => state.matchingReport.data);
  const score = Number.isFinite(matchData?.aiOverallScore) ? matchData.aiOverallScore : 0;
  const title = matchData?.jobName || "Matching report";
  const subtitle = matchData?.resumeFullName || matchData?.candidateName || "Candidate";

  return (
    <div className="flex items-center gap-4 border-b border-neutral-200 p-5 bg-white">
      <ScoreCard score={score} />

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
        <div className="text-base font-bold text-neutral-900">{title}</div>
        <div className="text-[13px] font-medium text-neutral-500">{subtitle}</div>
      </div>
    </div>
  );
};

export default SidebarHeader;
