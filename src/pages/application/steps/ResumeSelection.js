import React from 'react';
import { FileText, CheckCircle2, Upload, Briefcase, Sparkles, Eye } from 'lucide-react';
import Loading from '@/components/Loading';
import StepWrapper from './StepWrapper';
import { useNavigate } from 'react-router-dom';
import { getEvaluationHistoryScore, getEvaluationHistoryId } from '@/pages/job-detail/check-match-modal/matchHistory';

const ResumeSelection = ({
    jobId,
    resumes,
    selectedResumeId,
    newlyUploadedResume,
    isUploading,
    onSelectResume,
    onUpload, onCheckMatch,
    isStartingMatching
}) => {
    const navigate = useNavigate();

    const handleActionClick = (e, resume) => {
        e.stopPropagation();
        const evaluationId = getEvaluationHistoryId(resume);

        if (evaluationId) {
            navigate(`/match-report/${evaluationId}`, {
                state: { jobId, resumeId: resume.id, matchSource: "existing" }
            });
        } else {
            if (onCheckMatch) {
                onCheckMatch(resume.id);
            }
        }
    };
    return (
        <StepWrapper
            icon={<Briefcase size={18} />}
            title="Select Resume"
            step="01"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resumes?.map((resume) => {
                    const isSelected = selectedResumeId === resume.id && !newlyUploadedResume;
                    const score = getEvaluationHistoryScore(resume);
                    const evaluationId = getEvaluationHistoryId(resume);

                    return (
                        <div
                            key={resume.id}
                            onClick={() => onSelectResume(resume.id)}
                            className={`group relative p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${isSelected
                                ? 'border-orange-500 bg-orange-50 shadow-sm'
                                : 'border-gray-100 bg-white hover:border-orange-200 hover:shadow-sm'
                                }`}
                        >
                            <div className="flex items-center gap-4 min-w-0 flex-1">
                                <div className={`p-2.5 rounded-lg shrink-0 ${isSelected ? 'bg-orange-500/10 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                                    <FileText size={18} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-gray-900 truncate" title={resume.resumeName || resume.fileName}>
                                            {resume.resumeName || resume.fileName}
                                        </p>

                                        {score !== null && score !== undefined && (
                                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[11px] font-black">{score}% Match</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-1">
                                        Last updated: {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    disabled={isStartingMatching}
                                    onClick={(e) => handleActionClick(e, resume)}
                                    className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all ${evaluationId
                                            ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                                            : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                                        }`}
                                    title={evaluationId ? 'View Report' : 'Check AI Match'}
                                >
                                    {isStartingMatching ? (
                                        <Loading inline size={16} />
                                    ) : evaluationId ? (
                                        <Eye size={18} />
                                    ) : (
                                        <Sparkles size={18} />
                                    )}
                                </button>

                                {isSelected ? (
                                    <CheckCircle2 className="text-orange-500" size={20} />
                                ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-orange-300" />
                                )}
                            </div>
                        </div>
                    );
                })}

                {newlyUploadedResume && (
                    <div
                        onClick={() => onSelectResume(newlyUploadedResume.id, true)}
                        className={`group relative p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${selectedResumeId === newlyUploadedResume.id
                            ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                            : 'border-gray-100 bg-white hover:border-emerald-200 hover:shadow-sm'
                            }`}
                    >
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                            <div className={`p-2.5 rounded-lg shrink-0 ${selectedResumeId === newlyUploadedResume.id ? 'bg-emerald-500/10 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                <CheckCircle2 size={18} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate" title={newlyUploadedResume.fileName}>{newlyUploadedResume.fileName}</p>
                                <p className="text-[11px] text-emerald-600 mt-1">Newly Uploaded</p>
                            </div>
                        </div>
                        {selectedResumeId === newlyUploadedResume.id && (
                            <div className="bg-emerald-500 rounded-full p-1 text-white scale-105">
                                <CheckCircle2 size={16} />
                            </div>
                        )}
                    </div>
                )}

                <label className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-orange-200 transition-all group">
                    {isUploading ? (
                        <Loading inline size={24} />
                    ) : (
                        <Upload size={18} className="text-gray-500 group-hover:text-orange-500" />
                    )}
                    <span className="text-sm font-semibold text-gray-600 group-hover:text-orange-500">Upload New CV</span>
                    <input type="file" className="hidden" onChange={onUpload} accept=".pdf,.doc,.docx" />
                </label>
            </div>
        </StepWrapper>
    );
};

export default ResumeSelection;
