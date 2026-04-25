import { useParams, useNavigate } from 'react-router-dom';
import { Button as AntButton } from 'antd';
import { ArrowLeft, FileWarning, FolderOpen } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-orange-50/40 px-6">
        <div className="w-full max-w-lg">
          <div className="relative bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 px-8 py-12 sm:px-12 sm:py-14 text-center overflow-hidden">
            <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-orange-100/60 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-amber-100/40 blur-3xl" />

            <div className="relative mx-auto mb-7 w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <FileWarning size={40} className="text-white" strokeWidth={2} />
            </div>

            <h2 className="relative text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Resume not available
            </h2>
            <p className="relative mt-3 text-sm sm:text-base text-gray-500 leading-relaxed max-w-sm mx-auto">
              This resume doesn't exist or you don't have permission to edit it. Head back to your resume library to continue.
            </p>

            <div className="relative mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 transition-all"
              >
                <ArrowLeft size={18} />
                Go back
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard/resumes')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 shadow-md shadow-orange-500/20 transition-all"
              >
                <FolderOpen size={18} />
                Back to Resumes
              </button>
            </div>
          </div>
        </div>
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
