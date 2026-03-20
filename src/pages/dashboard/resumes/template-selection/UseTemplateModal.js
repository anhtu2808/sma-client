import React, { useState } from "react";
import { Modal } from "antd";
import { useGetCandidateResumesQuery } from "@/apis/resumeApi";
import Loading from "@/components/Loading";
import { RESUME_TYPES } from "@/constant";

const UseTemplateModal = ({ open, onCancel, template, onCreateNew, onSelectExisting, isCreating, isCloning }) => {
    const [step, setStep] = useState("choose"); // "choose" | "select-cv"

    const { data: resumes = [], isLoading: isLoadingResumes } = useGetCandidateResumesQuery(
        { type: RESUME_TYPES.ORIGINAL },
        { skip: !open || step !== "select-cv" }
    );

    const handleClose = () => {
        setStep("choose");
        onCancel();
    };

    const handleCreateNew = () => {
        setStep("choose");
        onCreateNew(template);
    };

    const handleSelectCV = (resume) => {
        setStep("choose");
        onSelectExisting(template, resume.id);
    };

    const handleGoBack = () => {
        setStep("choose");
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            centered
            width={560}
            destroyOnClose
            className="use-template-modal"
            title={null}
            closable
        >
            {step === "choose" ? (
                <div className="py-2">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Use Template</h2>
                        <p className="text-sm text-gray-500">
                            Choose how you want to start with template <strong>{template?.name}</strong>
                        </p>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                        {/* Option 1: Create New CV */}
                        <button
                            type="button"
                            onClick={handleCreateNew}
                            disabled={isCreating}
                            className={`w-full text-left p-5 rounded-xl border-2 border-gray-100 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-200 group cursor-pointer ${isCreating ? 'opacity-70 pointer-events-none' : ''}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
                                    {isCreating ? <Loading inline size={20} /> : <span className="material-icons-round text-white text-[24px]">add_circle</span>}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-gray-900 text-base mb-1 group-hover:text-orange-600 transition-colors">
                                        Create New CV
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        Start from scratch with this template. You will fill in your personal information, experience, and skills yourself.
                                    </p>
                                </div>
                                <span className="material-icons-round text-gray-300 group-hover:text-orange-400 text-[20px] mt-1 transition-colors">
                                    arrow_forward
                                </span>
                            </div>
                        </button>

                        {/* Option 2: Choose from uploaded CVs */}
                        <button
                            type="button"
                            onClick={() => setStep("select-cv")}
                            className="w-full text-left p-5 rounded-xl border-2 border-gray-100 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-200 group cursor-pointer"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
                                    <span className="material-icons-round text-white text-[24px]">folder_open</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-gray-900 text-base mb-1 group-hover:text-orange-600 transition-colors">
                                        Choose from uploaded CVs
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        Use data from CVs uploaded in the Attachments section to automatically fill in the template.
                                    </p>
                                </div>
                                <span className="material-icons-round text-gray-300 group-hover:text-orange-400 text-[20px] mt-1 transition-colors">
                                    arrow_forward
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
            ) : (
                /* Step 2: Select from uploaded CVs */
                <div className="py-2">
                    {/* Header with back button */}
                    <div className="mb-5">
                        <button
                            type="button"
                            onClick={handleGoBack}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3 transition-colors cursor-pointer"
                        >
                            <span className="material-icons-round text-[18px]">arrow_back</span>
                            Back
                        </button>
                        <h2 className="text-lg font-bold text-gray-900 mb-1">Choose from uploaded CVs</h2>
                        <p className="text-sm text-gray-500">Choose a CV from the Attachments list</p>
                    </div>

                    {/* CV List */}
                    {isLoadingResumes ? (
                        <div className="flex items-center justify-center py-12">
                            <Loading size={88} className="py-0" />
                        </div>
                    ) : resumes.length === 0 ? (
                        <div className="text-center py-10">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <span className="material-icons-round text-gray-400 text-[32px]">inbox</span>
                            </div>
                            <p className="text-gray-500 font-medium mb-1">No CVs yet</p>
                            <p className="text-sm text-gray-400">Please upload CVs in the Attachments section first.</p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
                            {resumes.map((resume) => {
                                const fileName = resume.fileName || resume.resumeName || `Resume #${resume.id}`;
                                const isPdf = fileName.toLowerCase().endsWith(".pdf");
                                return (
                                    <button
                                        key={resume.id}
                                        type="button"
                                        onClick={() => handleSelectCV(resume)}
                                        disabled={isCloning}
                                        className={`w-full text-left p-4 rounded-xl border border-gray-100 hover:border-orange-300 hover:bg-orange-50/30 transition-all duration-200 group flex items-center gap-4 cursor-pointer ${isCloning ? 'opacity-70 pointer-events-none' : ''}`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isPdf ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"}`}>
                                            <span className="material-icons-round text-[22px]">
                                                {isPdf ? "picture_as_pdf" : "description"}
                                            </span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-gray-900 text-sm truncate group-hover:text-orange-600 transition-colors">
                                                {fileName}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                ID: {resume.id}
                                            </p>
                                        </div>
                                        <span className="material-icons-round text-gray-300 group-hover:text-orange-400 text-[18px] transition-colors">
                                            arrow_forward
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
};

export default UseTemplateModal;
