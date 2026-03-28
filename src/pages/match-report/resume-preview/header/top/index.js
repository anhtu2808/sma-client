import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { setActiveDocumentTab } from "@/store/slices/matchingReportSlice";
import ReEvaluateModal from "@/pages/match-report/components/ReEvaluateModal";

const HeaderTop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { evaluationId } = useParams();
  const [isReEvaluateModalOpen, setIsReEvaluateModalOpen] = useState(false);
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
      <div className="mb-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            if (evaluationData?.resumeId) {
              navigate(`/match-report/${evaluationId}/enhancements`, {
                state: { resumeId: evaluationData.resumeId, jobId: evaluationData.jobId },
              });
            }
          }}
          disabled={!evaluationData?.resumeId}
          className="rounded border border-primary bg-white px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          <span className="material-icons-round text-[16px]">edit_note</span>
          Edit Resume
        </button>
        <button
          type="button"
          onClick={() => setIsReEvaluateModalOpen(true)}
          disabled={!evaluationData?.jobId}
          className="rounded border border-primary bg-white px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          <span className="material-icons-round text-[16px]">upload_file</span>
          Re-evaluate
        </button>
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

      <ReEvaluateModal
        open={isReEvaluateModalOpen}
        onClose={() => setIsReEvaluateModalOpen(false)}
        jobId={evaluationData?.jobId}
        currentResumeId={evaluationData?.resumeId}
        currentScore={evaluationData?.overallScore}
      />
    </header>
  );
};

export default HeaderTop;
