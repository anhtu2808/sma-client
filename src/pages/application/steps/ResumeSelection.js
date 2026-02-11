import React from 'react';
import { FileText, CheckCircle2, Upload, Loader2, Briefcase } from 'lucide-react';
import StepWrapper from './StepWrapper';

const ResumeSelection = ({
    resumes,
    selectedResumeId,
    newlyUploadedResume,
    isUploading,
    onSelectResume,
    onUpload
}) => {
    return (
        <StepWrapper
            icon={<Briefcase size={18} />}
            title="Select Resume"
            step="01"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resumes?.map((resume) => {
                    const isSelected = selectedResumeId === resume.id && !newlyUploadedResume;
                    return (
                        <div
                            key={resume.id}
                            onClick={() => onSelectResume(resume.id)}
                            className={`group relative p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${isSelected
                                ? 'border-orange-500 bg-orange-50 shadow-sm'
                                : 'border-gray-100 bg-white hover:border-orange-200 hover:shadow-sm'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-orange-500/10 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                                    <FileText size={18} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-semibold text-gray-900 truncate pr-4">{resume.resumeName || resume.fileName}</p>
                                    <p className="text-[11px] text-gray-500 mt-1">Verified by AI</p>
                                </div>
                            </div>
                            {isSelected && (
                                <CheckCircle2 className="text-orange-500" size={20} />
                            )}
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
                        <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-lg ${selectedResumeId === newlyUploadedResume.id ? 'bg-emerald-500/10 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                <CheckCircle2 size={18} />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold text-gray-900 truncate pr-4">{newlyUploadedResume.fileName}</p>
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
                    {isUploading ? <Loader2 className="animate-spin text-orange-500" /> : <Upload size={18} className="text-gray-500 group-hover:text-orange-500" />}
                    <span className="text-sm font-semibold text-gray-600 group-hover:text-orange-500">Upload New CV</span>
                    <input type="file" className="hidden" onChange={onUpload} accept=".pdf,.doc,.docx" />
                </label>
            </div>
        </StepWrapper>
    );
};

export default ResumeSelection;
