import { useParams, useNavigate } from 'react-router-dom';
import { Button as AntButton } from 'antd';
import { ArrowLeft } from 'lucide-react';

import { useGetResumeQuery } from '@/apis/resumeApi';
import Loading from '@/components/Loading';
import ResumeEditor from '@/pages/match-report/enhancements/resume-editor';

const ResumeEditorPage = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { data: resumeData, isLoading, error } = useGetResumeQuery(
    { resumeId: Number(resumeId) },
    { skip: !resumeId }
  );

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><Loading /></div>;
  }

  if (error || !resumeData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-gray-500">Resume not found or you don't have permission to edit it.</p>
        <AntButton onClick={() => navigate('/dashboard/resumes')}>Back to Resumes</AntButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-200">
        <AntButton
          type="text"
          icon={<ArrowLeft size={18} />}
          onClick={() => navigate('/dashboard/resumes')}
        />
        <h1 className="text-base font-semibold text-gray-800 truncate">
          {resumeData.resumeName || 'Resume Editor'}
        </h1>
      </div>
      <div className="flex-1 min-h-0">
        <ResumeEditor resumeId={Number(resumeId)} />
      </div>
    </div>
  );
};

export default ResumeEditorPage;
