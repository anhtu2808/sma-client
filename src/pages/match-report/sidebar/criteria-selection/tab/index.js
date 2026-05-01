import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "antd";
import { setActiveCriteriaId } from "@/store/slices/matchingReportSlice";
import { getFixProgress, getScoreColor } from "../utils";
import { formatScore } from "@/utils/formatScore";

const getProgressColors = (progress) => {
  if (progress < 50) return { fill: "bg-red-400", track: "bg-red-100", border: "border-red-200" };
  if (progress < 80) return { fill: "bg-amber-400", track: "bg-amber-100", border: "border-amber-200" };
  return { fill: "bg-emerald-400", track: "bg-emerald-100", border: "border-emerald-200" };
};

const getScoreBarColor = (score) => {
  const s = Number(score) || 0;
  if (s < 50) return "bg-red-400";
  if (s < 80) return "bg-amber-400";
  return "bg-emerald-400";
};

const Tab = ({ tab }) => {
  const dispatch = useDispatch();
  const activeCriteriaId = useSelector((state) => state.matchingReport.ui.activeCriteriaId);

  const isActive = tab.id === activeCriteriaId;
  const { fixed, total, percent } = useMemo(() => getFixProgress(tab.details), [tab.details]);
  const { fill, track, border } = getProgressColors(percent);
  const aiScore = formatScore(tab.aiScore);
  const scoreFill = getScoreBarColor(aiScore);
  const scorePercent = Math.max(0, Math.min(Number(aiScore) || 0, 100));

  return (
    <button
      type="button"
      onClick={() => dispatch(setActiveCriteriaId(tab.id))}
      className={`relative flex flex-1 flex-col gap-1.5 border-r border-neutral-200 px-3 py-2 text-left transition-colors last:border-r-0 ${
        isActive ? "bg-neutral-100" : "hover:bg-neutral-50"
      }`}
    >
      <Tooltip title={`AI matching score: ${aiScore}`}>
        <div className="flex items-center gap-2">
          <span
            className={`min-w-0 flex-1 truncate text-sm ${
              isActive ? "font-bold text-neutral-900" : "font-semibold text-neutral-700"
            }`}
          >
            {tab.criteriaName || tab.criteriaType || "Criteria"}
          </span>
          <div className="flex shrink-0 flex-col-reverse gap-[2px]">
            {[0, 1, 2].map((idx) => {
              const filled = scorePercent >= (idx + 1) * 33;
              return (
                <span
                  key={idx}
                  className={`h-[3px] w-3 rounded-sm transition-colors ${
                    filled ? scoreFill : "bg-neutral-200"
                  }`}
                />
              );
            })}
          </div>
          <span className={`shrink-0 text-xs tabular-nums font-bold ${getScoreColor(aiScore)}`}>
            {aiScore}
          </span>
        </div>
      </Tooltip>

      <Tooltip title={total === 0 ? "No gaps to fix" : `${fixed} of ${total} issues fixed`}>
        <div className="flex items-center gap-1.5">
          <div className={`h-[6px] flex-1 overflow-hidden rounded-full border ${border} ${track}`}>
            <div
              className={`h-full rounded-full ${fill} transition-[width] duration-500 ease-out`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className={`shrink-0 text-[10px] tabular-nums font-bold ${isActive ? "text-neutral-900" : "text-neutral-500"}`}>
            {total === 0 ? "—" : `${fixed}/${total}`}
          </span>
        </div>
      </Tooltip>
    </button>
  );
};

export default Tab;
