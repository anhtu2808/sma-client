import { getMatchLevelConfig } from "./overviewUtils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const OverviewScoreSection = ({ score = 0, matchLevel = "FAIR", summary = "" }) => {
  const levelConfig = getMatchLevelConfig(matchLevel);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-md">
      {/* Match level badge + score */}
      <div className="mb-4 flex items-center gap-3">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${levelConfig.badgeBg} ${levelConfig.badgeText}`}
        >
          <FontAwesomeIcon icon={levelConfig.icon} className="text-[16px]" />
          {levelConfig.label}
        </div>
        <span className="font-heading text-2xl font-bold leading-none" style={{ color: levelConfig.ringColor }}>
          {score}
        </span>
        <span className="text-sm text-neutral-400">/ 100</span>
      </div>

      {/* Summary */}
      {summary && (
        summary.includes("<li>") ? (
          <ul className="list-disc space-y-1 pl-4 text-left text-base leading-relaxed text-neutral-800"
            dangerouslySetInnerHTML={{ __html: summary }}
          />
        ) : (
          <p className="text-left text-base leading-relaxed text-neutral-800">{summary}</p>
        )
      )}
    </div>
  );
};

export default OverviewScoreSection;
