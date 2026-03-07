import { useDispatch, useSelector } from "react-redux";
import { setActiveSidebarTab } from "@/store/slices/matchingReportSlice";

const getProgressColors = (progress) => {
  if (progress < 50) return { fill: "bg-red-400", track: "bg-red-100", border: "border-red-200" };
  if (progress < 80) return { fill: "bg-amber-400", track: "bg-amber-100", border: "border-amber-200" };
  return { fill: "bg-emerald-400", track: "bg-emerald-100", border: "border-emerald-200" };
};

const Tab = ({ tab }) => {
  const dispatch = useDispatch();
  const activeSidebarTab = useSelector((state) => state.matchingReport.activeSidebarTab);
  
  const isActive = tab.key === activeSidebarTab;
  const { fill, track, border } = getProgressColors(tab.progress || 0);

  return (
    <button
      type="button"
      onClick={() => dispatch(setActiveSidebarTab(tab.key))}
      className={`relative flex flex-1 flex-col items-center justify-center border-r border-neutral-200 px-2 py-2 text-center transition-colors last:border-r-0 ${
        isActive ? "bg-neutral-100" : "hover:bg-neutral-50"
      }`}
    >
      <p
        className={`text-sm ${
          isActive ? "font-bold text-neutral-900" : "font-semibold text-neutral-700"
        }`}
      >
        {tab.label}
      </p>
      
      <div className={`mt-1.5 h-[6px] w-[50px] overflow-hidden rounded-full border ${border} ${track}`}>
        <div
          className={`h-full rounded-full ${fill}`}
          style={{ width: `${Math.max(0, Math.min(100, tab.progress || 0))}%` }}
        />
      </div>
      
    </button>
  );
};

export default Tab;
