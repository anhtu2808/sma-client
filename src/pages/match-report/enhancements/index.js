import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  useGetResumeQuery,
  useGetOrCreateEnhancementQuery,
  useGenerateEnhancementSuggestionMutation,
  useLazyGetEnhancementSuggestionQuery,
  useUpdateEnhancementContentMutation,
} from '@/apis/resumeApi';
import { setMatchingReportData } from '@/store/slices/matchingReportSlice';
import { mapSuggestionsToStore } from '@/utils/matchingReportUtils';
import MatchReportSidebar from '@/pages/match-report/sidebar';
import Loading from '@/components/Loading';
import { Result } from 'antd';
import Button from '@/components/Button';
import EditorContext from './EditorContext';
import ResumeEditor from './resume-editor';
import EnhancementLoading from './EnhancementLoading';
import { buildResumeHtml } from './resume-editor/buildResumeHtml';

const PARSED_STATUSES = ['FINISH', 'DONE', 'SUCCESS'];

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
  //   init → saving-content → generating → ready   (first visit, no content)
  //   init → generating → ready                    (content exists, no suggestions)
  //   init → loading-suggestions → ready           (suggestions already exist)
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
  const [updateContent] = useUpdateEnhancementContentMutation();
  const [generateSuggestion, { isLoading: isRegenerating }] = useGenerateEnhancementSuggestionMutation();
  const [triggerGetSuggestions] = useLazyGetEnhancementSuggestionQuery();

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
    updateContent({ id: enhancement.id, content: html })
      .unwrap()
      .then(() => {
        phaseHandledRef.current = false;
        setPhase('generating');
      })
      .catch((err) => {
        phaseHandledRef.current = false;
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
          setPhase('error');
          setErrorMessage(
            err?.data?.message || err?.message || 'Failed to load suggestions. Please try again.'
          );
        }
      });
  }, [phase, enhancement, triggerGetSuggestions, dispatch]);

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

  if (phase !== 'ready') {
    return <EnhancementLoading />;
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
            />
          </main>
        </div>
      </div>
    </EditorContext.Provider>
  );
};

export default Enhancements;
