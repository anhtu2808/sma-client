import { useGetMatchingDetailQuery } from "@/apis/matchingApi";
import { useGetResumeByIdQuery } from "@/apis/resumeApi";
import Loading from "@/components/Loading";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PdfViewer from "./pdf-viewer";
import JobDetail from "./job-detail";

const openLinkClassName =
  "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90";

const PreviewStateCard = ({ title, description, action }) => (
  <div className="mx-auto flex h-full min-h-[520px] w-full max-w-[920px] items-center justify-center rounded-xl border border-neutral-200 bg-white p-8 shadow-soft">
    <div className="max-w-lg text-center">
      <h2 className="font-heading text-2xl font-bold text-neutral-900">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  </div>
);

const MatchReportResumePreview = () => {
  const activeDocumentTab = useSelector((state) => state.matchingReport.activeDocumentTab);
  const { evaluationId } = useParams();
  const evaluationIdNumber = Number.parseInt(evaluationId || "", 10);
  const shouldLoadResume = activeDocumentTab === "resume" && Number.isFinite(evaluationIdNumber);

  const {
    data: matchingDetail,
    isFetching: isMatchingDetailFetching,
    isError: isMatchingDetailError,
  } = useGetMatchingDetailQuery(
    { evaluationId: evaluationIdNumber },
    { skip: !shouldLoadResume }
  );

  const resumeId = matchingDetail?.resumeId;
  const {
    data: resumeData,
    isFetching: isResumeFetching,
    isError: isResumeError,
  } = useGetResumeByIdQuery(resumeId, { skip: !shouldLoadResume || !resumeId });

  const renderContent = () => {
    if (activeDocumentTab !== "resume") {
      return <JobDetail />;
    }

    if (isMatchingDetailFetching || (resumeId && isResumeFetching)) {
      return (
        <div className="flex h-full min-h-[680px] items-center justify-center">
          <Loading size={96} className="py-0" />
        </div>
      );
    }

    const resumeUrl = `${resumeData?.resumeUrl || ""}`.trim();
    const isErrorOrMissing =
      !Number.isFinite(evaluationIdNumber) ||
      isMatchingDetailError ||
      !resumeId ||
      isResumeError ||
      !resumeUrl;

    if (isErrorOrMissing) {
      return (
        <PreviewStateCard
          title="Resume preview is unavailable"
          description="The resume file could not be loaded or is invalid."
        />
      );
    }

    const resumeLabel = resumeData?.fileName || resumeData?.resumeName || "Resume file";
    const isPdfFile =
      /\.pdf($|[?#])/i.test(resumeUrl) || /\.pdf$/i.test(`${resumeData?.fileName || ""}`.trim());

    if (!isPdfFile) {
      return (
        <PreviewStateCard
          title="Preview is only available for PDF files"
          description={`${resumeLabel} is not a PDF file, so it can't be rendered inside the viewer.`}
          action={
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className={openLinkClassName}
            >
              <span className="material-icons-round text-[18px]">open_in_new</span>
              Open file
            </a>
          }
        />
      );
    }

    return (
      <PdfViewer
        resumeUrl={resumeUrl}
        renderError={(error) => (
          <PreviewStateCard
            title="Unable to load PDF"
            description={error?.message || "The resume file could not be rendered."}
          />
        )}
      />
    );
  };

  return (
    <section className="flex-1 overflow-y-auto">
      {renderContent()}
    </section>
  );
};

export default MatchReportResumePreview;
