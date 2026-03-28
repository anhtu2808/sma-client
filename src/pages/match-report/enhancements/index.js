import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  useGetResumeQuery,
  useGetOrCreateEnhancementQuery,
} from '@/apis/resumeApi';
import { useGetMatchingDetailQuery } from '@/apis/matchingApi';
import { setMatchingReportData } from '@/store/slices/matchingReportSlice';
import { mapEvaluationToStore } from '@/utils/matchingReportUtils';
import MatchReportSidebar from '@/pages/match-report/sidebar';
import Loading from '@/components/Loading';
import { Result } from 'antd';
import Button from '@/components/Button';
import ResumeEditor from './resume-editor';

const PARSED_STATUSES = ['FINISH', 'DONE', 'SUCCESS'];

const Enhancements = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { evaluationId } = useParams();
  const { resumeId, jobId } = location.state || {};

  // Load evaluation data into Redux for Sidebar (if not already loaded)
  const matchData = useSelector((state) => state.matchingReport.data);
  const needsEvalData = !!evaluationId && !matchData;
  const { data: evalData } = useGetMatchingDetailQuery(
    { evaluationId: Number(evaluationId) },
    { skip: !needsEvalData }
  );

  useEffect(() => {
    if (evalData && needsEvalData) {
      dispatch(setMatchingReportData(mapEvaluationToStore(evalData)));
    }
  }, [evalData, needsEvalData, dispatch]);

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

  return (
    <div className="min-h-screen bg-surface-light text-neutral-900 xl:h-screen">
      <div className="flex min-h-screen flex-col xl:h-screen xl:flex-row">
        <MatchReportSidebar />
        <main className="flex min-w-0 flex-1 flex-col bg-surface-light">
          <ResumeEditor
            resumeId={resumeId}
            enhancementId={enhancement?.id}
            initialContent={enhancement?.content}
          />
        </main>
      </div>
    </div>
  );
};

export default Enhancements;
