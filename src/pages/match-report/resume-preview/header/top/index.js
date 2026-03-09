import { useDispatch, useSelector } from "react-redux";
import { setActiveDocumentTab } from "@/store/slices/matchingReportSlice";

const HeaderTop = () => {
  const dispatch = useDispatch();
  const activeDocumentTab = useSelector((state) => state.matchingReport.activeDocumentTab);

  return (
    <header className="border-b border-neutral-200 px-4 pt-2 sm:px-6">
      <nav className="-mb-px flex flex-wrap gap-4 sm:gap-6">
        {[
          { key: "resume", label: "Resume" },
          { key: "jobDescription", label: "Job Description" },
        ].map((tab) => {
          const isActive = tab.key === activeDocumentTab;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => dispatch(setActiveDocumentTab(tab.key))}
              className={`border-b-[2px] pb-[6px] text-[13px] font-semibold transition-colors ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};

export default HeaderTop;