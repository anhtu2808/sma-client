import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useLazyGetMatchingDetailQuery, useLazyGetMatchingStatusQuery, useStartMatchingDetailMutation } from "@/apis/matchingApi";
import useRequireLoginRedirect from "@/hooks/useRequireLoginRedirect";
import MatchReportHeader from "@/pages/match-report/resume-preview/header";
import { resetMatchingReportState, setMatchingReportData } from "@/store/slices/matchingReportSlice";
import { mapEvaluationToStore } from "@/utils/matchingReportUtils";
import MatchReportOverview from "@/pages/match-report/overview";
import JobDetail from "@/pages/match-report/resume-preview/job-detail";
import ReportSidebar from "@/pages/match-report/report-sidebar";
import MatchingLoading from "@/pages/match-report/loading";
import Loading from "@/components/Loading";
import Button from "@/components/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowsRotate, faCircleInfo, faRotate } from '../../utils/icons';
import { Sparkles } from 'lucide-react';

const MATCHING_POLL_INTERVAL_MS = 2_000;
const MATCHING_POLL_TIMEOUT_MS = 180_000;

const normalizeEvaluationStatus = (status) =>
  typeof status === "string" ? status.toUpperCase() : "WAITING";

const MatchReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { evaluationId } = useParams();
  const requireLogin = useRequireLoginRedirect();

  const pollingTimerRef = useRef(null);
  const pollingStartedAtRef = useRef(null);

  const evaluationIdFromParams = Number.parseInt(evaluationId || "", 10);
  const hasValidEvaluationId = Number.isFinite(evaluationIdFromParams);

  const [isAuthorized, setIsAuthorized] = useState(null);
  const [phase, setPhase] = useState("polling");
  const [activeEvaluationId, setActiveEvaluationId] = useState(
    Number.isFinite(evaluationIdFromParams) ? evaluationIdFromParams : null
  );
  const [latestStatus, setLatestStatus] = useState("WAITING");
  const [hasInitialStatus, setHasInitialStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pollingSessionId, setPollingSessionId] = useState(0);

  const [triggerGetMatchingStatus] = useLazyGetMatchingStatusQuery();
  const [triggerGetMatchingDetail, { isLoading: isDetailLoading }] = useLazyGetMatchingDetailQuery();
  const [startMatchingDetail, { isLoading: isRetrying }] = useStartMatchingDetailMutation();

  const activeDocumentTab = useSelector((state) => state.matchingReport.ui.activeDocumentTab);
  const { jobId: jobIdFromState, resumeId: resumeIdFromState } = location.state || {};
  const [failedMeta, setFailedMeta] = useState({ jobId: null, resumeId: null });

  const jobId = jobIdFromState ?? failedMeta.jobId;
  const resumeId = resumeIdFromState ?? failedMeta.resumeId;

  const stopPolling = useCallback(() => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }
    pollingStartedAtRef.current = null;
  }, []);

  const handleRetry = async () => {
    stopPolling();

    if (!jobId || !resumeId) {
      setErrorMessage("Missing job or resume reference. Please go back to job details and try again.");
      return;
    }

    try {
      const newEvaluationId = await startMatchingDetail({
        jobId: Number(jobId),
        resumeId: Number(resumeId),
      }).unwrap();

      const nextEvaluationId = Number(newEvaluationId);
      if (!Number.isFinite(nextEvaluationId)) {
        throw new Error("Invalid matching evaluation id");
      }

      setErrorMessage("");
      setLatestStatus("WAITING");
      setHasInitialStatus(false);
      setActiveEvaluationId(nextEvaluationId);
      setPhase("polling");
      pollingStartedAtRef.current = null;

      if (nextEvaluationId !== evaluationIdFromParams) {
        navigate(`/match-report/${nextEvaluationId}`, {
          state: { jobId, resumeId, matchSource: "new" },
          replace: true,
        });
      }
    } catch (error) {
      setErrorMessage(
        error?.data?.message || "Retry failed. Please go back to job details and try again."
      );
    }
  };

  useEffect(() => {
    setIsAuthorized(
      requireLogin({ warningMessage: "Please log in to check AI matching score." })
    );
  }, [requireLogin]);

  useEffect(() => {
    dispatch(resetMatchingReportState());
  }, [dispatch, evaluationIdFromParams]);

  useEffect(() => {
    if (isAuthorized !== true) return;

    setErrorMessage("");
    setLatestStatus("WAITING");
    setHasInitialStatus(false);
    stopPolling();

    if (!hasValidEvaluationId) {
      setActiveEvaluationId(null);
      setPhase("failed");
      setErrorMessage("Matching request is missing or invalid. Please start AI matching again.");
      return;
    }

    setActiveEvaluationId(evaluationIdFromParams);
    setPhase("polling");
  }, [evaluationIdFromParams, hasValidEvaluationId, isAuthorized, stopPolling]);

  useEffect(() => {
    if (isAuthorized !== true) return;
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
        setHasInitialStatus(true);

        if (status === "FINISH") {
          stopPolling();
          setPhase("success");
          return;
        }

        if (status === "FAIL") {
          stopPolling();
          setPhase("failed");
          setErrorMessage("AI matching failed. Please go back and try matching again.");

          // Ensure we have jobId/resumeId for retry even when landing directly via URL
          if (!jobIdFromState || !resumeIdFromState) {
            try {
              const detail = await triggerGetMatchingDetail({
                evaluationId: activeEvaluationId,
              }).unwrap();
              if (detail?.jobId && detail?.resumeId) {
                setFailedMeta({ jobId: detail.jobId, resumeId: detail.resumeId });
              }
            } catch (_) {
              // swallow — user can still navigate back
            }
          }
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
  }, [activeEvaluationId, isAuthorized, phase, stopPolling, triggerGetMatchingStatus]);

  useEffect(
    () => () => {
      stopPolling();
    },
    [stopPolling]
  );

  useEffect(() => {
    if (phase !== "success" || !activeEvaluationId) return;

    const fetchDetail = async () => {
      try {
        const data = await triggerGetMatchingDetail({ evaluationId: activeEvaluationId }).unwrap();
        dispatch(setMatchingReportData(mapEvaluationToStore(data)));
      } catch (error) {
        setPhase("failed");
        setErrorMessage(
          error?.data?.message || error?.message || "Unable to fetch evaluation details."
        );
      }
    };

    void fetchDetail();
  }, [activeEvaluationId, dispatch, phase, triggerGetMatchingDetail]);

  if (isAuthorized !== true) {
    return null;
  }

  if (phase === "polling") {
    if (!hasInitialStatus) {
      return <Loading fullScreen={true} />;
    }
    return <MatchingLoading key={pollingSessionId} status={latestStatus} />;
  }

  if (isDetailLoading && phase !== "failed") {
    return <Loading fullScreen={true} />;
  }

  if (phase === "failed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-white px-6 py-10">
        <div className="relative w-full max-w-[460px] overflow-hidden rounded-2xl bg-white p-8 text-center shadow-[0_8px_32px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-primary to-orange-500" />
          <div className="mx-auto mb-5 flex h-[64px] w-[64px] items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 ring-1 ring-orange-100">
            <Sparkles size={28} className="text-primary" strokeWidth={2.2} />
          </div>
          <h1 className="text-[22px] font-bold tracking-tight text-neutral-900">
            We couldn't finish your match
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-neutral-500 px-2">
            {errorMessage || "AI matching failed. Please go back and try matching again."}
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 ring-1 ring-slate-200/70">
            <FontAwesomeIcon icon={faCircleInfo} className="text-[14px] text-emerald-500" />
            <p className="text-[13px] text-neutral-600">
              No worries — your AI credit was refunded.
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => jobId ? navigate(`/jobs/${jobId}`) : navigate(-1)}
              disabled={isRetrying}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-[14px] font-semibold text-neutral-700 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-[16px] text-gray-500" />
              Back to Job Detail
            </button>
            <button
              type="button"
              onClick={handleRetry}
              disabled={isRetrying}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRetrying ? (
                <FontAwesomeIcon icon={faArrowsRotate} className="animate-spin text-[16px]" />
              ) : (
                <FontAwesomeIcon icon={faRotate} className="text-[16px]" />
              )}
              {isRetrying ? "Retrying..." : "Try Again"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-light text-neutral-900 xl:h-screen">
      <div className="flex min-h-screen flex-col xl:h-screen xl:flex-row">
        <ReportSidebar />

        <main className="flex min-w-0 flex-1 flex-col bg-surface-light">
          <MatchReportHeader />
          {activeDocumentTab === "resume" ? (
            <MatchReportOverview />
          ) : (
            <section className="flex-1 overflow-y-auto">
              <JobDetail />
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default MatchReport;
