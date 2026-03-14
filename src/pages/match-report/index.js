import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useLazyGetMatchingDetailQuery, useLazyGetMatchingStatusQuery, useStartMatchingDetailMutation } from "@/apis/matchingApi";
import useRequireLoginRedirect from "@/hooks/useRequireLoginRedirect";
import MatchReportHeader from "@/pages/match-report/resume-preview/header";
import { resetMatchingReportState, setMatchingReportData } from "@/store/slices/matchingReportSlice";
import { mapEvaluationToStore } from "@/utils/matchingReportUtils";
import MatchReportResumePreview from "@/pages/match-report/resume-preview";
import MatchReportSidebar from "@/pages/match-report/sidebar";
import MatchingLoading from "@/pages/match-report/loading";
import Loading from "@/components/Loading";
import Button from "@/components/Button";

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

  const [triggerGetMatchingStatus] = useLazyGetMatchingStatusQuery();
  const [triggerGetMatchingDetail, { isLoading: isDetailLoading }] = useLazyGetMatchingDetailQuery();
  const [startMatchingDetail, { isLoading: isRetrying }] = useStartMatchingDetailMutation();

  const { jobId, resumeId } = location.state || {};

  const handleRetry = async () => {
    if (!jobId || !resumeId) {
      if (jobId) {
        navigate(`/jobs/${jobId}`);
      } else {
        navigate("/jobs");
      }
      return;
    }

    try {
      const newEvaluationId = await startMatchingDetail({
        jobId: Number(jobId),
        resumeId: Number(resumeId),
      }).unwrap();

      if (!Number.isFinite(Number(newEvaluationId))) {
        throw new Error("Invalid matching evaluation id");
      }

      navigate(`/match-report/${Number(newEvaluationId)}`, {
        state: { jobId, resumeId },
        replace: true,
      });
    } catch (error) {
      setErrorMessage("Retry failed. Please go back to job details and try again.");
    }
  };

  const stopPolling = useCallback(() => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }
    pollingStartedAtRef.current = null;
  }, []);

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
    return <MatchingLoading status={latestStatus} />;
  }

  if (isDetailLoading) {
    return <Loading fullScreen={true} />;
  }

  if (phase === "failed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6 py-10">
        <div className="w-full max-w-[480px] overflow-hidden rounded-2xl bg-white text-center shadow-sm p-8 ring-1 ring-gray-900/5 transition-all">
          <div className="mx-auto flex h-[64px] w-[64px] items-center justify-center rounded-2xl bg-red-50 mb-5">
            <span className="material-icons-round text-[32px] text-red-500">warning_amber</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Oops, something went wrong!
          </h1>
          <p className="mt-3 text-[15px] text-gray-500 leading-relaxed px-2">
            {errorMessage || "AI matching failed. Please go back and try matching again."}
          </p>
          <div className="mt-6 rounded-xl bg-orange-50 p-4 border border-orange-100 flex items-center justify-center gap-2">
            <span className="material-icons-round text-orange-500 text-[18px]">replay_circle_filled</span>
            <p className="text-[14px] font-semibold text-orange-700 tracking-tight">Your AI credit has been refunded.</p>
          </div>
          
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              mode="primary"
              shape="rounded"
              fullWidth
              className="py-2.5 text-[14px] whitespace-nowrap"
              onClick={handleRetry}
              disabled={isRetrying}
              iconLeft={
                isRetrying ? (
                  <span className="material-icons-round animate-spin text-[18px]">autorenew</span>
                ) : (
                  <span className="material-icons-round text-[18px] group-hover:-rotate-90 transition-transform duration-300">refresh</span>
                )
              }
            >
              {isRetrying ? "Retrying..." : "Try Again"}
            </Button>
            <Button
              mode="default"
              shape="rounded"
              fullWidth
              className="py-2.5 text-[14px] bg-white text-gray-700 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 hover:text-gray-900 whitespace-nowrap"
              onClick={() => jobId ? navigate(`/jobs/${jobId}`) : navigate(-1)}
              disabled={isRetrying}
              iconLeft={<span className="material-icons-round text-[18px] text-gray-500">arrow_back</span>}
            >
              Back to Job Detail
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-light text-neutral-900 xl:h-screen">
      <div className="flex min-h-screen flex-col xl:h-screen xl:flex-row">
        <MatchReportSidebar />

        <main className="flex min-w-0 flex-1 flex-col bg-surface-light">
          <MatchReportHeader />
          <MatchReportResumePreview />
        </main>
      </div>
    </div>
  );
};

export default MatchReport;
