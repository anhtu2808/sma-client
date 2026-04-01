import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  useGetResumeQuery,
  useGetOrCreateEnhancementQuery,
  useGenerateEnhancementSuggestionMutation,
} from '@/apis/resumeApi';
import { useLazyGetMatchingSuggestionsQuery } from '@/apis/matchingApi';
import { setMatchingReportData } from '@/store/slices/matchingReportSlice';
import { mapSuggestionsToStore } from '@/utils/matchingReportUtils';
import MatchReportSidebar from '@/pages/match-report/sidebar';
import Loading from '@/components/Loading';
import { Result } from 'antd';
import Button from '@/components/Button';
import Lottie from 'lottie-react';
import aiLoadingAnimation from '@/assets/lottie/ai-loading.json';
import EditorContext from './EditorContext';
import ResumeEditor from './resume-editor';

const PARSED_STATUSES = ['FINISH', 'DONE', 'SUCCESS'];

const SuggestionOverlay = () => (
  <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
    <div className="flex flex-col items-center gap-3">
      <div className="h-[120px] w-[120px]">
        <Lottie animationData={aiLoadingAnimation} loop autoplay />
      </div>
      <p className="text-sm font-medium text-neutral-600">Generating suggestions...</p>
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-primary"
            style={{
              animation: 'pulse-dot 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.25}s`,
            }}
          />
        ))}
      </div>
    </div>
    <style>{`
      @keyframes pulse-dot {
        0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
        40% { opacity: 1; transform: scale(1.2); }
      }
    `}</style>
  </div>
);

const Enhancements = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { evaluationId, enhancementId } = useParams();
  const { resumeId, jobId } = location.state || {};

  // Editor↔Sidebar communication via context
  const [editorApi, setEditorApi] = useState({ fixInEditor: null, fixingDetailId: null, editor: null });
  const handleEditorReady = useCallback((api) => setEditorApi(api), []);
  const editorContextValue = useMemo(() => editorApi, [editorApi]);

  // Phase state machine:
  //   init → waiting-for-content → generating → loading-suggestions → ready
  //   init → generating → loading-suggestions → ready  (if content already exists)
  //   init → loading-suggestions → ready                (if suggestions already exist)
  const [phase, setPhase] = useState('init');
  const [errorMessage, setErrorMessage] = useState('');
  const phaseHandledRef = useRef(false);

  // Fetch original resume to check parse status
  const { data: resumeData, isLoading: isLoadingResume, isError } = useGetResumeQuery(
    { resumeId },
    { skip: !resumeId }
  );

  const isParsed = resumeData && PARSED_STATUSES.includes(resumeData.parseStatus);

  // Get or create enhancement (idempotent - safe on F5)
  const { data: enhancement, isLoading: isLoadingEnhancement } = useGetOrCreateEnhancementQuery(
    { resumeId, jobId },
    { skip: !resumeId || !jobId || !isParsed }
  );

  // API hooks
  const [generateSuggestion] = useGenerateEnhancementSuggestionMutation();
  const [triggerGetSuggestions] = useLazyGetMatchingSuggestionsQuery();

  // Determine initial phase based on enhancement data
  useEffect(() => {
    if (!enhancement || phase !== 'init') return;

    if (enhancement.generateSuggestion === 'FINISH') {
      // Suggestions already generated, just load them
      setPhase('loading-suggestions');
    } else if (enhancement.content) {
      // Content exists but suggestions not yet generated
      setPhase('generating');
    } else {
      // No content yet — wait for editor to save it first
      setPhase('waiting-for-content');
    }
  }, [enhancement, phase]);

  // Callback from ResumeEditor when initial content is saved
  const handleInitialContentSaved = useCallback(() => {
    setPhase((prev) => {
      if (prev === 'waiting-for-content') return 'generating';
      return prev;
    });
  }, []);

  // Phase: generating — call POST suggestion API
  useEffect(() => {
    if (phase !== 'generating' || !enhancement?.id) return;
    if (phaseHandledRef.current) return;
    phaseHandledRef.current = true;

    generateSuggestion({ enhancementId: enhancement.id })
      .unwrap()
      .then(() => {
        phaseHandledRef.current = false;
        setPhase('loading-suggestions');
      })
      .catch((err) => {
        phaseHandledRef.current = false;
        setPhase('error');
        setErrorMessage(
          err?.data?.message || err?.message || 'Failed to generate suggestions. Please try again.'
        );
      });
  }, [phase, enhancement?.id, generateSuggestion]);

  // Phase: loading-suggestions — call GET suggestions API
  useEffect(() => {
    if (phase !== 'loading-suggestions' || !evaluationId) return;
    if (phaseHandledRef.current) return;
    phaseHandledRef.current = true;

    triggerGetSuggestions({ evaluationId: Number(evaluationId) })
      .unwrap()
      .then((data) => {
        dispatch(setMatchingReportData(mapSuggestionsToStore(data)));
        phaseHandledRef.current = false;
        setPhase('ready');
      })
      .catch((err) => {
        phaseHandledRef.current = false;
        setPhase('error');
        setErrorMessage(
          err?.data?.message || err?.message || 'Failed to load suggestions. Please try again.'
        );
      });
  }, [phase, evaluationId, triggerGetSuggestions, dispatch]);

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
    const statusMessages = {
      WAITING: 'Your resume is waiting to be parsed. Please check back later.',
      PARSING: 'Your resume is currently being parsed. Please wait...',
      FAIL: 'Resume parsing failed. Please try uploading again.',
    };
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Result
          status={resumeData.parseStatus === 'FAIL' ? 'error' : 'info'}
          title="Resume Not Ready"
          subTitle={statusMessages[resumeData.parseStatus] || 'Resume is not available for editing.'}
          extra={
            <Button mode="primary" shape="rounded" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          }
        />
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
            <Button mode="primary" shape="rounded" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  const isLoadingSuggestions = phase !== 'ready';

  return (
    <EditorContext.Provider value={editorContextValue}>
      <div className="min-h-screen bg-surface-light text-neutral-900 xl:h-screen">
        <div className="flex min-h-screen flex-col xl:h-screen xl:flex-row">
          {!isLoadingSuggestions && <MatchReportSidebar />}
          <main className="relative flex min-w-0 flex-1 flex-col bg-surface-light">
            {isLoadingSuggestions && <SuggestionOverlay />}
            <ResumeEditor
              resumeId={resumeId}
              enhancementId={enhancement?.id}
              initialContent={enhancement?.content}
              onEditorReady={handleEditorReady}
              onInitialContentSaved={handleInitialContentSaved}
            />
          </main>
        </div>
      </div>
    </EditorContext.Provider>
  );
};

export default Enhancements;
