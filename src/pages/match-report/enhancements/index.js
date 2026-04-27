import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Modal } from 'antd';
import toastMessage from '@/utils/toastMessage';
import {
  useGetResumeQuery,
  useGetOrCreateEnhancementQuery,
  useGenerateEnhancementSuggestionMutation,
  useLazyGetEnhancementSuggestionQuery,
  useUpdateEnhancementContentMutation,
  useReScoreEnhancementMutation,
  useParseCandidateResumeMutation,
} from '@/apis/resumeApi';
import { Sparkles, Loader2, RotateCw, ArrowLeft } from 'lucide-react';
import {
  useLazyGetMatchingStatusQuery,
  useLazyGetMatchingDetailQuery,
} from '@/apis/matchingApi';
import { useGetJobByIdQuery } from '@/apis/jobApi';
import { useGetFeatureUsageQuery } from '@/apis/featureUsageApi';
import { setMatchingReportData } from '@/store/slices/matchingReportSlice';
import { mapSuggestionsToStore, mapEvaluationToStore } from '@/utils/matchingReportUtils';
import MatchReportSidebar from '@/pages/match-report/sidebar';
import Loading from '@/components/Loading';
import { Result } from 'antd';
import Button from '@/components/Button';
import EditorContext from './EditorContext';
import ResumeEditor from './resume-editor';
import EnhancementLoading from './EnhancementLoading';
import ReScoreLoading from './ReScoreLoading';
import ExportEnhancementModal from './ExportEnhancementModal';
import { buildResumeHtml } from './resume-editor/buildResumeHtml';
import VersionHistoryDrawer from './version-history/VersionHistoryDrawer';

const PARSED_STATUSES = ['FINISH', 'DONE', 'SUCCESS'];

const Enhancements = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { evaluationId, enhancementId } = useParams();
  const { resumeId, jobId } = location.state || {};

  // Editor↔Sidebar communication via context
  const [editorApi, setEditorApi] = useState({
    fixInEditor: null,
    applySuggestion: null,
    fixingDetailId: null,
    editor: null,
    applyVersionResponse: null,
  });
  const handleEditorReady = useCallback((api) => setEditorApi(api), []);
  const editorContextValue = useMemo(() => editorApi, [editorApi]);

  // Phase state machine:
  //   init → saving-content → generating → ready   (first visit, no content)
  //   init → generating → ready                    (content exists, no suggestions)
  //   init → loading-suggestions → ready           (suggestions already exist)
  const [phase, setPhase] = useState('init');
  const [errorMessage, setErrorMessage] = useState('');
  const [failedPhase, setFailedPhase] = useState(null);
  const phaseHandledRef = useRef(false);

  // Fetch original resume to check parse status.
  const { data: resumeData, isLoading: isLoadingResume, isError, refetch: refetchResume } =
    useGetResumeQuery({ resumeId }, { skip: !resumeId });

  const [parseCandidateResume, { isLoading: isReParsing }] = useParseCandidateResumeMutation();

  const isParsed = resumeData && PARSED_STATUSES.includes(resumeData.parseStatus);

  // Auto-poll while parsing is still in flight so the screen transitions on its own.
  useEffect(() => {
    if (!resumeId) return undefined;
    const status = resumeData?.parseStatus;
    if (status !== 'WAITING' && status !== 'PARSING') return undefined;
    const id = setInterval(() => refetchResume(), 2500);
    return () => clearInterval(id);
  }, [resumeId, resumeData?.parseStatus, refetchResume]);

  const handleRetryParse = useCallback(async () => {
    if (!resumeId) return;
    try {
      await parseCandidateResume({ resumeId }).unwrap();
      refetchResume();
    } catch {
      toastMessage.error('Could not restart parsing. Please try again.');
    }
  }, [resumeId, parseCandidateResume, refetchResume]);

  // Get or create enhancement (idempotent - safe on F5)
  const { data: enhancement, isLoading: isLoadingEnhancement } = useGetOrCreateEnhancementQuery(
    { resumeId, jobId },
    { skip: !resumeId || !jobId || !isParsed }
  );

  // API hooks
  const [updateContent] = useUpdateEnhancementContentMutation();
  const [generateSuggestion, { isLoading: isRegenerating }] = useGenerateEnhancementSuggestionMutation();
  const [triggerGetSuggestions] = useLazyGetEnhancementSuggestionQuery();

  // Re-score hooks and state
  const [reScoreEnhancement, { isLoading: isReScoring }] = useReScoreEnhancementMutation();
  const [triggerGetStatus] = useLazyGetMatchingStatusQuery();
  const [triggerGetDetail] = useLazyGetMatchingDetailQuery();
  const [reScoreStatus, setReScoreStatus] = useState(null); // null | 'polling' | 'regenerating-suggestions' | 'success' | 'error'
  const [reScoreEvalId, setReScoreEvalId] = useState(null);
  const reScoreInFlightRef = useRef(false);

  // Re-score loading screen state
  const [isReScoreLoading, setIsReScoreLoading] = useState(false);

  // Feature usage for credit info in confirmation modal
  const { data: featureUsageData } = useGetFeatureUsageQuery();
  const matchingScoreUsage = featureUsageData?.find((f) => f.featureKey === 'MATCHING_SCORE');

  // Export modal state
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Fetch job info for export modal context
  const { data: jobResponse } = useGetJobByIdQuery(jobId, { skip: !jobId });
  const jobData = jobResponse?.data;

  // Determine initial phase based on enhancement data
  useEffect(() => {
    if (!enhancement || phase !== 'init') return;

    if (enhancement.content) {
      // Always try GET first — loading-suggestions falls back to generating if empty
      setPhase('loading-suggestions');
    } else {
      setPhase('saving-content');
    }
  }, [enhancement, phase]);

  // Phase: saving-content — build HTML from resume and save it
  useEffect(() => {
    if (phase !== 'saving-content' || !enhancement?.id || !resumeData) return;
    if (phaseHandledRef.current) return;
    phaseHandledRef.current = true;

    const html = buildResumeHtml(resumeData);
    updateContent({ id: enhancement.id, content: html, saveType: 'AUTOSAVE' })
      .unwrap()
      .then(() => {
        phaseHandledRef.current = false;
        setPhase('generating');
      })
      .catch((err) => {
        phaseHandledRef.current = false;
        setFailedPhase('saving-content');
        setPhase('error');
        setErrorMessage(err?.data?.message || err?.message || 'Failed to save resume content.');
      });
  }, [phase, enhancement?.id, resumeData, updateContent]);

  // Phase: generating — call POST suggestion API and use response directly
  useEffect(() => {
    if (phase !== 'generating' || !enhancement?.id) return;
    if (phaseHandledRef.current) return;
    phaseHandledRef.current = true;

    generateSuggestion({ enhancementId: enhancement.id })
      .unwrap()
      .then((data) => {
        if (data?.contexts && data.contexts.length > 0) {
          dispatch(setMatchingReportData(mapSuggestionsToStore(data)));
          phaseHandledRef.current = false;
          setPhase('ready');
        } else {
          phaseHandledRef.current = false;
          setPhase('loading-suggestions');
        }
      })
      .catch((err) => {
        phaseHandledRef.current = false;
        setFailedPhase('generating');
        setPhase('error');
        setErrorMessage(
          err?.data?.message || err?.message || 'Failed to generate suggestions. Please try again.'
        );
      });
  }, [phase, enhancement?.id, generateSuggestion, dispatch]);

  // Phase: loading-suggestions — call GET enhancement suggestions API
  useEffect(() => {
    if (phase !== 'loading-suggestions' || !enhancement?.id) return;
    if (phaseHandledRef.current) return;
    phaseHandledRef.current = true;

    triggerGetSuggestions({ enhancementId: enhancement.id })
      .unwrap()
      .then((data) => {
        const hasContexts = data?.contexts && data.contexts.length > 0;
        if (hasContexts) {
          dispatch(setMatchingReportData(mapSuggestionsToStore(data)));
          phaseHandledRef.current = false;
          setPhase('ready');
        } else if (enhancement?.content && enhancement?.generateSuggestion === 'NONE') {
          phaseHandledRef.current = false;
          setPhase('generating');
        } else {
          dispatch(setMatchingReportData(mapSuggestionsToStore(data)));
          phaseHandledRef.current = false;
          setPhase('ready');
        }
      })
      .catch((err) => {
        phaseHandledRef.current = false;
        if (enhancement?.content && enhancement?.generateSuggestion === 'NONE') {
          setPhase('generating');
        } else {
          setFailedPhase('loading-suggestions');
          setPhase('error');
          setErrorMessage(
            err?.data?.message || err?.message || 'Failed to load suggestions. Please try again.'
          );
        }
      });
  }, [phase, enhancement, triggerGetSuggestions, dispatch]);

  // Internal rescore executor (called after user confirms modal)
  const executeReScore = useCallback(async () => {
    reScoreInFlightRef.current = true;
    setIsReScoreLoading(true);

    try {
      const html = editorApi.editor.getHTML();
      await updateContent({ id: enhancement.id, content: html, saveType: 'MANUAL_SAVE' }).unwrap();
    } catch {
      reScoreInFlightRef.current = false;
      setIsReScoreLoading(false);
      toastMessage.error('Could not save changes before re-scoring');
      return;
    }

    try {
      const evalId = await reScoreEnhancement({ enhancementId: enhancement.id }).unwrap();
      setReScoreEvalId(evalId);
      setReScoreStatus('polling');
    } catch {
      reScoreInFlightRef.current = false;
      setIsReScoreLoading(false);
      toastMessage.error('Could not start re-scoring');
    }
  }, [enhancement?.id, editorApi?.editor, updateContent, reScoreEnhancement]);

  // Re-score handler: show confirmation modal then trigger rescore
  const handleReScore = useCallback(() => {
    if (
      !enhancement?.id ||
      !editorApi?.editor ||
      reScoreInFlightRef.current ||
      isReScoring ||
      reScoreStatus === 'polling' ||
      reScoreStatus === 'regenerating-suggestions'
    ) {
      return;
    }

    const remaining = matchingScoreUsage?.remaining;
    const creditInfo =
      remaining != null
        ? `This action will use 1 scoring credit. You have ${remaining} credit${remaining !== 1 ? 's' : ''} remaining.`
        : 'This action will use 1 scoring credit.';

    Modal.confirm({
      title: 'Re-score Resume',
      content: creditInfo,
      okText: 'Confirm',
      cancelText: 'Cancel',
      centered: true,
      okButtonProps: { style: { backgroundColor: '#f97316', borderColor: '#f97316' } },
      onOk: executeReScore,
    });
  }, [
    enhancement?.id,
    editorApi?.editor,
    isReScoring,
    reScoreStatus,
    matchingScoreUsage?.remaining,
    executeReScore,
  ]);

  // Polling effect: check re-score status every 2s until FINISH/FAIL or 3min timeout
  useEffect(() => {
    if (reScoreStatus !== 'polling' || !reScoreEvalId || !enhancement?.id) return;

    const interval = setInterval(async () => {
      try {
        const status = await triggerGetStatus({ evaluationId: reScoreEvalId }).unwrap();
        if (status === 'FINISH') {
          clearInterval(interval);
          clearTimeout(timeout);

          const data = await triggerGetDetail({ evaluationId: reScoreEvalId }).unwrap();
          if (data) {
            dispatch(setMatchingReportData(mapEvaluationToStore(data)));
          }

          setReScoreStatus('regenerating-suggestions');
          try {
            const suggestionData = await generateSuggestion({ enhancementId: enhancement.id }).unwrap();
            if (suggestionData?.contexts) {
              dispatch(setMatchingReportData(mapSuggestionsToStore(suggestionData)));
            }
            reScoreInFlightRef.current = false;
            setIsReScoreLoading(false);
            setReScoreStatus('success');
            toastMessage.success('Re-scored and updated suggestions successfully!');
          } catch {
            reScoreInFlightRef.current = false;
            setIsReScoreLoading(false);
            setReScoreStatus('success');
            toastMessage.warning('Score updated but could not regenerate suggestions');
          }
        } else if (status === 'FAIL') {
          clearInterval(interval);
          clearTimeout(timeout);
          reScoreInFlightRef.current = false;
          setIsReScoreLoading(false);
          setReScoreStatus('error');
          toastMessage.error('Re-scoring failed');
        }
      } catch {
        clearInterval(interval);
        clearTimeout(timeout);
        reScoreInFlightRef.current = false;
        setIsReScoreLoading(false);
        setReScoreStatus('error');
      }
    }, 2000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      reScoreInFlightRef.current = false;
      setIsReScoreLoading(false);
      setReScoreStatus('error');
      toastMessage.error('Re-scoring timed out');
    }, 180000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [
    reScoreStatus,
    reScoreEvalId,
    enhancement?.id,
    triggerGetStatus,
    triggerGetDetail,
    generateSuggestion,
    dispatch,
  ]);

  const handleOpenExportModal = useCallback(() => {
    if (!enhancement?.id || !editorApi?.editor) return;
    setExportModalOpen(true);
  }, [enhancement?.id, editorApi?.editor]);

  const handleRestoreVersion = useCallback((response) => {
    editorApi?.applyVersionResponse?.(response);
  }, [editorApi]);

  const handleRetry = useCallback(() => {
    if (!failedPhase) return;
    setErrorMessage('');
    phaseHandledRef.current = false;
    setPhase(failedPhase);
    setFailedPhase(null);
  }, [failedPhase]);

  // Manual re-generate: save current editor content then call POST suggestion
  const handleRegenerateSuggestions = useCallback(async () => {
    if (!enhancement?.id || isRegenerating) return;
    try {
      const data = await generateSuggestion({ enhancementId: enhancement.id }).unwrap();
      if (data?.contexts) {
        dispatch(setMatchingReportData(mapSuggestionsToStore(data)));
      }
    } catch {
      // error handled by isRegenerating state — user can retry
    }
  }, [enhancement?.id, isRegenerating, generateSuggestion, dispatch]);

  // --- Render based on phase ---

  if (isLoadingResume || (isParsed && isLoadingEnhancement)) {
    return <Loading fullScreen />;
  }

  if (isError || !resumeId || !jobId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Result
          status="error"
          title="Failed to load resume"
          subTitle="Please try again later."
          extra={
            <Button mode="primary" shape="rounded" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  if (resumeData && !isParsed) {
    const isFail = resumeData.parseStatus === 'FAIL';
    const isInProgress = resumeData.parseStatus === 'WAITING' || resumeData.parseStatus === 'PARSING';
    const title = isFail
      ? "We couldn't read your resume"
      : isInProgress
        ? 'Preparing your resume'
        : 'Resume not ready yet';
    const subtitle = isFail
      ? 'Resume parsing failed. Try parsing it again or upload a new file.'
      : resumeData.parseStatus === 'PARSING'
        ? 'Your resume is being parsed. This usually takes a few seconds…'
        : resumeData.parseStatus === 'WAITING'
          ? 'Your resume is queued for parsing. It will start shortly.'
          : 'Resume is not available for editing.';

    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-white px-6 py-10">
        <div className="relative w-full max-w-[460px] overflow-hidden rounded-2xl bg-white p-8 text-center shadow-[0_8px_32px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-primary to-orange-500" />
          <div className="mx-auto mb-5 flex h-[64px] w-[64px] items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 ring-1 ring-orange-100">
            {isInProgress ? (
              <Loader2 size={28} className="animate-spin text-primary" strokeWidth={2.2} />
            ) : (
              <Sparkles size={28} className="text-primary" strokeWidth={2.2} />
            )}
          </div>
          <h1 className="text-[22px] font-bold tracking-tight text-neutral-900">{title}</h1>
          <p className="mt-2 px-2 text-[14px] leading-relaxed text-neutral-500">{subtitle}</p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isReParsing}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-[14px] font-semibold text-neutral-700 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft size={16} className="text-gray-500" />
              Go Back
            </button>
            {isFail && (
              <button
                type="button"
                onClick={handleRetryParse}
                disabled={isReParsing}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isReParsing ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <RotateCw size={16} />
                )}
                {isReParsing ? 'Retrying...' : 'Try Again'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Result
          status="error"
          title="Something went wrong"
          subTitle={errorMessage || 'Failed to generate suggestions.'}
          extra={
            <div className="flex items-center justify-center gap-3">
              {failedPhase ? (
                <Button mode="primary" shape="rounded" onClick={handleRetry}>
                  Try Again
                </Button>
              ) : null}
              <Button mode="secondary" shape="rounded" onClick={() => navigate(-1)}>
                Go Back
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  if (phase !== 'ready' || isReScoreLoading) {
    return isReScoreLoading ? <ReScoreLoading /> : <EnhancementLoading />;
  }

  return (
    <EditorContext.Provider value={editorContextValue}>
      <div className="min-h-screen bg-surface-light text-neutral-900 xl:h-screen">
        <div className="flex min-h-screen flex-col xl:h-screen xl:flex-row">
          <MatchReportSidebar />
          <main className="relative flex min-w-0 flex-1 flex-col bg-surface-light">
            <ResumeEditor
              resumeId={resumeId}
              enhancementId={enhancement?.id}
              initialContent={enhancement?.content}
              onEditorReady={handleEditorReady}
              onRegenerateSuggestions={handleRegenerateSuggestions}
              isRegenerating={isRegenerating}
              onReScore={handleReScore}
              isReScoring={isReScoring}
              reScoreStatus={reScoreStatus}
              onExport={handleOpenExportModal}
              isExporting={exportModalOpen}
              onOpenHistory={() => setHistoryOpen(true)}
            />
          </main>
        </div>
      </div>
      <ExportEnhancementModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        editor={editorApi?.editor}
        enhancementId={enhancement?.id}
        originalResumeName={resumeData?.resumeName}
        jobId={jobId}
        jobTitle={jobData?.name}
        companyName={jobData?.company?.name}
      />
      <VersionHistoryDrawer
        open={historyOpen}
        enhancementId={enhancement?.id}
        onClose={() => setHistoryOpen(false)}
        onRestore={handleRestoreVersion}
      />
    </EditorContext.Provider>
  );
};

export default Enhancements;
