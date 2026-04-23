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

const Tab = ({ tab }) => {
  const dispatch = useDispatch();
  const activeCriteriaId = useSelector((state) => state.matchingReport.ui.activeCriteriaId);

  const isActive = tab.id === activeCriteriaId;
  const { fixed, total, percent } = useMemo(() => getFixProgress(tab.details), [tab.details]);
  const { fill, track, border } = getProgressColors(percent);
  const aiScore = formatScore(tab.aiScore);

  return (
    <button
      type="button"
      onClick={() => dispatch(setActiveCriteriaId(tab.id))}
      className={`relative flex flex-1 flex-col items-center justify-center border-r border-neutral-200 px-1 py-2 text-center transition-colors last:border-r-0 ${
        isActive ? "bg-neutral-100" : "hover:bg-neutral-50"
      }`}
    >
      <Tooltip title="AI matching score for this criterion">
        <p
          className={`text-sm ${
            isActive ? "font-bold text-neutral-900" : "font-semibold text-neutral-700"
          }`}
        >
          {tab.criteriaName || tab.criteriaType || "Criteria"}
          <span className={`ml-1 font-bold ${getScoreColor(aiScore)}`}>({aiScore})</span>
        </p>
      </Tooltip>

      <Tooltip title={total === 0 ? "No gaps to fix" : `${fixed} of ${total} issues fixed`}>
        <div className="mt-1.5 flex items-center gap-1.5">
          <div className={`h-[6px] w-[80px] overflow-hidden rounded-full border ${border} ${track}`}>
            <div
              className={`h-full rounded-full ${fill} transition-[width] duration-500 ease-out`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className={`text-[10px] tabular-nums font-bold ${isActive ? "text-neutral-900" : "text-neutral-500"}`}>
            {total === 0 ? "—" : `${fixed}/${total}`}
          </span>
        </div>
      </Tooltip>
    </button>
  );
};

export default Tab;
