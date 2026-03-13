import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setActiveDocumentTab } from "@/store/slices/matchingReportSlice";

const HeaderTop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeDocumentTab = useSelector((state) => state.matchingReport.ui.activeDocumentTab);
  const evaluationData = useSelector((state) => state.matchingReport.data);

  return (
    <header className="border-b border-neutral-200 px-4 pt-3 pb-0 sm:px-6 flex justify-between items-end">
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
              className={`border-b-[2px] pb-[10px] text-[13px] font-semibold transition-colors ${
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
      <div className="mb-2">
        <button
          type="button"
          onClick={() => {
            if (evaluationData?.jobId) {
              navigate(`/jobs/${evaluationData.jobId}/application`, {
                state: { presetResumeId: evaluationData?.resumeId },
              });
            }
          }}
          disabled={!evaluationData?.jobId}
          className="rounded bg-primary px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Apply Now
        </button>
      </div>
    </header>
  );
};

export default HeaderTop;
