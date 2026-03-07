import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetMatchingDetailQuery, useLazyGetMatchingStatusQuery } from "@/apis/matchingApi";
import useRequireLoginRedirect from "@/hooks/useRequireLoginRedirect";
import MatchReportHeader from "@/pages/match-report/header";
import { MATCH_REPORT_DATA } from "@/pages/match-report/mock-data";
import MatchReportResumePreview from "@/pages/match-report/resume-preview";
import MatchReportSidebar from "@/pages/match-report/sidebar";
import MatchingLoading from "@/pages/match-report/matching-loading";

const MATCHING_POLL_INTERVAL_MS = 2_000;
const MATCHING_POLL_TIMEOUT_MS = 180_000;

const normalizeEvaluationStatus = (status) =>
  typeof status === "string" ? status.toUpperCase() : "WAITING";

const MatchReport = () => {
  const navigate = useNavigate();
  const { evaluationId } = useParams();
  const { data: matchingDetail } = useGetMatchingDetailQuery({ evaluationId });
  const requireLogin = useRequireLoginRedirect();

  const hasAccessToken = Boolean(localStorage.getItem("accessToken"));
  const hasRedirectedRef = useRef(false);
  const pollingTimerRef = useRef(null);
  const pollingStartedAtRef = useRef(null);

  const evaluationIdFromParams = Number.parseInt(evaluationId || "", 10);
  const hasValidEvaluationId = Number.isFinite(evaluationIdFromParams);

  const [activeSidebarTab, setActiveSidebarTab] = useState("skills");
  const [activeDocumentTab, setActiveDocumentTab] = useState("resume");
  const [expandedSkillKeys, setExpandedSkillKeys] = useState([]);
  const [phase, setPhase] = useState("polling");
  const [activeEvaluationId, setActiveEvaluationId] = useState(
    Number.isFinite(evaluationIdFromParams) ? evaluationIdFromParams : null
  );
  const [latestStatus, setLatestStatus] = useState("WAITING");
  const [errorMessage, setErrorMessage] = useState("");

  const [triggerGetMatchingStatus] = useLazyGetMatchingStatusQuery();

  const activeSections = useMemo(
    () => MATCH_REPORT_DATA.sidebarContentByTab[activeSidebarTab] || [],
    [activeSidebarTab]
  );
  const reportRequestKey = useMemo(
    () => `${evaluationIdFromParams || "evaluation"}`,
    [evaluationIdFromParams]
  );

  const handleSidebarTabChange = (tabKey) => {
    setActiveSidebarTab(tabKey);
    setExpandedSkillKeys([]);
  };

  const handleToggleSkill = (skillKey) => {
    setExpandedSkillKeys((previous) => {
      if (previous.includes(skillKey)) {
        return previous.filter((item) => item !== skillKey);
      }
      return [...previous, skillKey];
    });
  };

  const stopPolling = useCallback(() => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }
    pollingStartedAtRef.current = null;
  }, []);

  useEffect(() => {
    if (hasAccessToken || hasRedirectedRef.current) return;

    hasRedirectedRef.current = true;
    requireLogin({ warningMessage: "Please log in to check AI matching score." });
  }, [hasAccessToken, requireLogin]);

  useEffect(() => {
    setActiveSidebarTab("skills");
    setActiveDocumentTab("resume");
    setExpandedSkillKeys([]);
  }, [reportRequestKey]);

  useEffect(() => {
    if (!hasAccessToken) return;

    setErrorMessage("");
    setLatestStatus("WAITING");
    stopPolling();

    if (!hasValidEvaluationId) {
      setActiveEvaluationId(null);
      setPhase("failed");
      setErrorMessage("Matching request is missing or invalid. Please start AI matching again.");
      return;
    }

    setActiveEvaluationId(evaluationIdFromParams);
    setPhase("polling");
  }, [evaluationIdFromParams, hasAccessToken, hasValidEvaluationId, stopPolling]);

  useEffect(() => {
    if (phase !== "polling" || !Number.isFinite(activeEvaluationId)) return;

    let cancelled = false;

    const pollStatus = async () => {
      if (pollingStartedAtRef.current == null) {
        pollingStartedAtRef.current = Date.now();
      }

      if (Date.now() - pollingStartedAtRef.current >= MATCHING_POLL_TIMEOUT_MS) {
        stopPolling();
        setPhase("failed");
        setErrorMessage("AI matching is still processing. Please go back and try again later.");
        return;
      }

      try {
        const status = normalizeEvaluationStatus(
          await triggerGetMatchingStatus({ evaluationId: activeEvaluationId }).unwrap()
        );

        if (cancelled) return;

        setLatestStatus(status);

        if (status === "FINISH") {
          stopPolling();
          setPhase("success");
          return;
        }

        if (status === "FAIL") {
          stopPolling();
          setPhase("failed");
          setErrorMessage("AI matching failed. Please go back and try matching again.");
        }
      } catch (error) {
        if (cancelled) return;

        stopPolling();
        setPhase("failed");
        setErrorMessage(
          error?.data?.message || error?.message || "Unable to check AI matching status."
        );
      }
    };

    pollingStartedAtRef.current = Date.now();
    void pollStatus();

    pollingTimerRef.current = setInterval(() => {
      void pollStatus();
    }, MATCHING_POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      stopPolling();
    };
  }, [activeEvaluationId, phase, stopPolling, triggerGetMatchingStatus]);

  useEffect(
    () => () => {
      stopPolling();
    },
    [stopPolling]
  );

  if (!hasAccessToken) {
    return null;
  }

  if (phase === "polling") {
    const subtitle =
      latestStatus === "PARTIAL"
        ? "AI is analyzing your resume in depth. Please keep this page open."
        : "AI matching is queued and will start shortly. Please wait a moment.";

    return <MatchingLoading title="AI matching in progress" subtitle={subtitle} />;
  }

  if (phase === "failed") {
    return (
      <div className="min-h-screen bg-[#F3F4F6] px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-red-500">Unable to complete AI matching</h1>
          <p className="mt-2 text-sm text-gray-600">
            {errorMessage || "An unexpected error occurred while processing AI matching."}
          </p>
          <button
            type="button"
            className="mt-5 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white"
            onClick={() => navigate("/jobs")}
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-light text-neutral-900 xl:h-screen">
      <div className="flex min-h-screen flex-col xl:h-screen xl:flex-row">
        <MatchReportSidebar
          scoreCard={MATCH_REPORT_DATA.scoreCard}
          sidebarTabs={MATCH_REPORT_DATA.sidebarTabs}
          activeSidebarTab={activeSidebarTab}
          onSidebarTabChange={handleSidebarTabChange}
          sections={activeSections}
          expandedSkillKeys={expandedSkillKeys}
          onToggleSkill={handleToggleSkill}
        />

        <main className="flex min-w-0 flex-1 flex-col bg-surface-light">
          <MatchReportHeader
            documentTabs={MATCH_REPORT_DATA.documentTabs}
            activeDocumentTab={activeDocumentTab}
            onDocumentTabChange={setActiveDocumentTab}
            editorStatus={MATCH_REPORT_DATA.editorStatus}
          />

          <MatchReportResumePreview
            activeDocumentTab={activeDocumentTab}
            resumePreview={MATCH_REPORT_DATA.resumePreview}
          />
        </main>
      </div>
    </div>
  );
};

export default MatchReport;
