import React, { useMemo, useState } from 'react';
import { Modal } from 'antd';
import { FileText, CheckCircle2, Upload, Briefcase, Sparkles, Eye, Clock } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Loading from '@/components/Loading';
import StepWrapper from './StepWrapper';
import { useNavigate } from 'react-router-dom';
import { getEvaluationHistoryScore, getEvaluationHistoryId } from '@/pages/job-detail/check-match-modal/matchHistory';
import PdfCvViewer from '@/pages/cv-preview/pdf-viewer';

dayjs.extend(relativeTime);

const getScoreColor = (score) => {
    if (score >= 80) return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
    if (score >= 60) return 'bg-lime-50 text-lime-700 border-lime-200 hover:bg-lime-100';
    if (score >= 40) return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
    return 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100';
};

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
    const [previewResume, setPreviewResume] = useState(null);

    const sortedResumes = useMemo(() => {
        if (!resumes) return [];
        const getTime = (r) => {
            const t = r.updatedAt || r.createdAt;
            return t ? new Date(t).getTime() : 0;
        };
        return [...resumes].sort((a, b) => getTime(b) - getTime(a));
    }, [resumes]);

    const handleScoreClick = (e, resume) => {
        e.stopPropagation();
        const evaluationId = getEvaluationHistoryId(resume);
        if (evaluationId) {
            navigate(`/match-report/${evaluationId}`, {
                state: { jobId, resumeId: resume.id, matchSource: "existing" }
            });
        }
    };

    const handleCheckMatchClick = (e, resume) => {
        e.stopPropagation();
        if (onCheckMatch) onCheckMatch(resume.id);
    };

    const handlePreviewClick = (e, resume) => {
        e.stopPropagation();
        setPreviewResume(resume);
    };
    return (
        <StepWrapper
            icon={<Briefcase size={18} />}
            title="Select Resume"
            step="01"
        >
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {sortedResumes.map((resume) => {
                    const isSelected = selectedResumeId === resume.id;
                    const score = getEvaluationHistoryScore(resume);
                    const evaluationId = getEvaluationHistoryId(resume);
                    const isNew = newlyUploadedResume?.id === resume.id;

                    return (
                        <div
                            key={resume.id}
                            onClick={() => onSelectResume(resume.id)}
                            className={`group relative p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${isSelected
                                ? 'border-orange-500 bg-orange-50 shadow-sm'
                                : 'border-gray-100 bg-white hover:border-orange-200 hover:shadow-sm'
                                }`}
                        >
                            {/* Left Icon */}
                            <div className={`p-2.5 rounded-lg shrink-0 ${isSelected ? 'bg-orange-500/10 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                                <FileText size={18} />
                            </div>

                            {/* Main Content: Info & Score */}
                            <div className="flex-1 min-w-0">
                                <p
                                    className="text-sm font-semibold text-gray-900 truncate"
                                    title={resume.resumeName || resume.fileName}
                                >
                                    {resume.resumeName || resume.fileName}
                                </p>
                                <div className="mt-1 flex items-center gap-2 flex-wrap">
                                    {(resume.updatedAt || resume.createdAt) && (
                                        <div className="flex items-center gap-1 text-[11px] text-gray-500">
                                            <Clock size={11} />
                                            <span title={dayjs(resume.updatedAt || resume.createdAt).format('DD/MM/YYYY HH:mm')}>
                                                Uploaded {dayjs(resume.updatedAt || resume.createdAt).fromNow()}
                                            </span>
                                        </div>
                                    )}
                                    {score !== null && score !== undefined ? (
                                        <button
                                            type="button"
                                            onClick={(e) => handleScoreClick(e, resume)}
                                            title="View match report"
                                            className={`flex shrink-0 items-center gap-1 px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${getScoreColor(score)}`}
                                        >
                                            <span className="text-[12px] font-black whitespace-nowrap">{Math.round(score)}</span>
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            disabled={isStartingMatching}
                                            onClick={(e) => handleCheckMatchClick(e, resume)}
                                            title="Check AI Match"
                                            className="flex shrink-0 items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-pointer disabled:opacity-60"
                                        >
                                            <Sparkles size={11} />
                                            <span className="text-[11px] font-semibold whitespace-nowrap">Check</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Right Actions: Buttons & Selection */}
                            <div className="flex items-center gap-2 shrink-0 ml-auto">
                                <button
                                    type="button"
                                    onClick={(e) => handlePreviewClick(e, resume)}
                                    className="flex items-center justify-center w-9 h-9 rounded-xl bg-transparent text-gray-700 hover:bg-black/5 hover:text-gray-900 transition-all"
                                    title="Preview resume"
                                >
                                    <Eye size={18} />
                                </button>

                                <div className="flex items-center justify-center w-6">
                                    {isSelected ? (
                                        <CheckCircle2 className="text-orange-500" size={20} />
                                    ) : (
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-orange-300" />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* {newlyUploadedResume && (
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
                )} */}

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

            <Modal
                open={!!previewResume}
                onCancel={() => setPreviewResume(null)}
                footer={null}
                width={1200}
                title={previewResume?.resumeName || previewResume?.fileName || 'Resume Preview'}
                destroyOnClose
                styles={{ body: { padding: 0, height: '85vh' } }}
            >
                {previewResume?.resumeUrl ? (
                    <div className="h-full w-full">
                        <PdfCvViewer fileUrl={previewResume.resumeUrl} />
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500">
                        No file available for preview.
                    </div>
                )}
            </Modal>
        </StepWrapper>
    );
};

export default ResumeSelection;
