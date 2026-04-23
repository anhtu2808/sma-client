import { getMatchLevelConfig } from "./overviewUtils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatScore } from '@/utils/formatScore';

const CANDIDATE_LEVEL_STYLE = {
  INTERN: 'bg-slate-100 text-slate-700',
  FRESHER: 'bg-sky-100 text-sky-700',
  JUNIOR: 'bg-emerald-100 text-emerald-700',
  MIDDLE: 'bg-amber-100 text-amber-700',
  SENIOR: 'bg-violet-100 text-violet-700',
  LEAD: 'bg-orange-100 text-orange-700',
  MANAGER: 'bg-rose-100 text-rose-700',
};

const OverviewScoreSection = ({ score = 0, matchLevel = "FAIR", summary = "", candidateLevel = null }) => {
  const levelConfig = getMatchLevelConfig(matchLevel);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-md">
      {/* Match level badge + score */}
      <div className="mb-4 flex items-center gap-3 flex-wrap">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${levelConfig.badgeBg} ${levelConfig.badgeText}`}
        >
          <FontAwesomeIcon icon={levelConfig.icon} className="text-[16px]" />
          {levelConfig.label}
        </div>
        <span className="font-heading text-2xl font-bold leading-none" style={{ color: levelConfig.ringColor }}>
          {formatScore(score)}
        </span>
        <span className="text-sm text-neutral-400">/ 100</span>
        {candidateLevel && (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wide ${CANDIDATE_LEVEL_STYLE[candidateLevel] || 'bg-gray-100 text-gray-700'}`}
            title="Candidate seniority level estimated by AI"
          >
            {candidateLevel}
          </span>
        )}
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
