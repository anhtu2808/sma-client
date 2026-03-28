import { useLocation, useNavigate } from 'react-router-dom';
import { useGetResumeQuery } from '@/apis/resumeApi';
import MatchReportSidebar from '@/pages/match-report/sidebar';
import Loading from '@/components/Loading';
import { Result } from 'antd';
import Button from '@/components/Button';
import ResumeEditor from './resume-editor';

const PARSED_STATUSES = ['FINISH', 'DONE', 'SUCCESS'];

const Enhancements = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resumeId } = location.state || {};

  const { data: resumeData, isLoading, isError } = useGetResumeQuery(
    { resumeId },
    { skip: !resumeId }
  );

  if (isLoading) {
    return <Loading fullScreen />;
  }

  if (isError || !resumeId) {
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

  if (resumeData && !PARSED_STATUSES.includes(resumeData.parseStatus)) {
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
          <ResumeEditor resumeData={resumeData} />
        </main>
      </div>
    </div>
  );
};

export default Enhancements;
