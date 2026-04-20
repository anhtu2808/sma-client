import { useSelector } from "react-redux";
import OverviewScoreSection from "./OverviewScoreSection";
import OverviewRadarChart from "./OverviewRadarChart";
import OverviewStrengths from "./OverviewStrengths";
import OverviewImprovements from "./OverviewImprovements";

const MatchReportOverview = () => {
  const matchData = useSelector((state) => state.matchingReport.data);

  if (!matchData) return null;

  const { aiOverallScore, matchLevel, summary, strengths, weakness, criteriaScores, candidateLevel } = matchData;

  return (
    <section className="flex-1 overflow-y-auto">
      <div className="mx-auto space-y-4 px-4 py-4 lg:px-6">
        {/* Score + Radar: 2-column on lg+ */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <OverviewScoreSection score={aiOverallScore} matchLevel={matchLevel} summary={summary} candidateLevel={candidateLevel} />
          <OverviewRadarChart criteriaScores={criteriaScores} />
        </div>

        {/* Strengths and Improvements */}
        <OverviewStrengths text={strengths} />
        <OverviewImprovements text={weakness} />
      </div>
    </section>
  );
};

export default MatchReportOverview;
