import useAnimatedScore from "@/hooks/useAnimatedScore";
import { getMatchLevelConfig } from "./overviewUtils";

const OverviewScoreSection = ({ score = 0, matchLevel = "FAIR", summary = "" }) => {
  const animatedScore = useAnimatedScore(score, 1200);
  const levelConfig = getMatchLevelConfig(matchLevel);

  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-md">
      {/* Score Ring + Badge */}
      <div className="flex items-start gap-4">
        <div className="relative flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90 transform">
            <circle
              stroke="#F3F4F6"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={radius}
              cx={size / 2}
              cy={size / 2}
            />
            <circle
              stroke={levelConfig.ringColor}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              r={radius}
              cx={size / 2}
              cy={size / 2}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <span
            className="absolute font-heading text-3xl font-bold leading-none"
            style={{ color: levelConfig.ringColor }}
          >
            {animatedScore}
          </span>
        </div>
        <div className="pt-2">
          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${levelConfig.badgeBg} ${levelConfig.badgeText}`}
          >
            <span className="material-icons-round text-[14px]">{levelConfig.icon}</span>
            {levelConfig.label}
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <p className="mt-4 text-left text-sm leading-relaxed text-neutral-600">{summary}</p>
      )}
    </div>
  );
};

export default OverviewScoreSection;
