import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Tooltip } from "antd";
import useAnimatedScore from "@/hooks/useAnimatedScore";

const getScoreColor = (score) => {
  if (score >= 80) return "#22C55E";
  if (score >= 60) return "#EAB308";
  if (score >= 40) return "#F97316";
  return "#EF4444";
};

const SidebarHeader = () => {
  const matchData = useSelector((state) => state.matchingReport.data);
  const score = Number.isFinite(matchData?.aiOverallScore) ? matchData.aiOverallScore : 0;
  const title = matchData?.jobName || "Matching report";
  const subtitle = matchData?.resumeFullName || matchData?.candidateName || "Candidate";

  const counts = useMemo(() => {
    const criteriaScores = matchData?.criteriaScores ?? [];
    const allDetails = criteriaScores.flatMap((cs) => cs.details || []);
    const partial = allDetails.filter((d) => d.status === "PARTIAL").length;
    const missing = allDetails.filter((d) => d.status === "MISSING" || d.status === "missing").length;
    const matched = allDetails.filter((d) => d.status === "MATCHED").length;
    const needsFix = partial + missing;
    const fixed = allDetails.filter((d) => d.isFixed).length;
    return { matched, partial, missing, needsFix, fixed, total: allDetails.length };
  }, [matchData?.criteriaScores]);

  const animatedScore = useAnimatedScore(score, 1000);
  const animatedMatched = useAnimatedScore(counts.matched, 600);
  const animatedFixed = useAnimatedScore(counts.fixed, 600);
  const animatedNeedsFix = useAnimatedScore(counts.needsFix, 600);
  const scoreColor = getScoreColor(score);

  return (
    <div className="flex flex-col border-b border-neutral-200 bg-white">
      <div className="p-5 pb-4">
        {/* Title row */}
        <div className="mb-4">
          <div className="text-base font-bold text-neutral-900 truncate leading-tight">{title}</div>
          <div className="text-[13px] font-medium text-neutral-500 mt-0.5">{subtitle}</div>
        </div>

        {/* Stats row */}
        <div className="flex items-stretch gap-3">
          {/* AI Score */}
          <Tooltip title="AI matching score based on resume and job requirements">
            <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-2.5 cursor-default min-w-[72px] shadow-sm">
              <span className="text-2xl font-extrabold tabular-nums leading-none text-neutral-800" style={{ color: scoreColor }}>
                {animatedScore}
              </span>
              <span className="text-[10px] font-semibold text-neutral-500 mt-1 uppercase tracking-wider">Score</span>
            </div>
          </Tooltip>

          {/* Matched */}
          <Tooltip title="Items that already match the job requirements">
            <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-2.5 cursor-default min-w-[72px] shadow-sm">
              <span className="text-2xl font-extrabold tabular-nums leading-none text-emerald-600">
                {animatedMatched}
              </span>
              <span className="text-[10px] font-semibold text-neutral-500 mt-1 uppercase tracking-wider">Matched</span>
            </div>
          </Tooltip>

          {/* Fix progress */}
          <Tooltip title={`${counts.fixed} of ${counts.needsFix} issues fixed (${counts.partial} partial, ${counts.missing} missing)`}>
            <div className="flex flex-1 flex-col justify-center rounded-xl border border-neutral-200 bg-white px-4 py-2.5 cursor-default min-w-[100px] shadow-sm">
              <div className="flex items-baseline gap-0.5">
                <span className="text-2xl font-extrabold tabular-nums leading-none text-neutral-800">
                  {animatedFixed}
                </span>
                <span className="text-sm font-bold text-neutral-300 mx-0.5">/</span>
                <span className="text-2xl font-extrabold tabular-nums leading-none text-neutral-800">
                  {animatedNeedsFix}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="h-1.5 flex-1 rounded-full bg-neutral-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-700 ease-out"
                    style={{ width: counts.needsFix > 0 ? `${(counts.fixed / counts.needsFix) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider shrink-0">Fixed</span>
              </div>
            </div>
          </Tooltip>
        </div>
      </div>

      <div className="px-5 pb-4">
        <div className="flex items-start gap-2.5 rounded-xl bg-amber-50/70 p-3 border border-amber-100">
          <div className="text-amber-500 mt-0.5 shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <p className="text-xs leading-relaxed text-amber-900 font-medium">
            <b>Note:</b> AI parsing may contain inaccuracies. Please double-check the content manually for the most accurate evaluation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SidebarHeader;
