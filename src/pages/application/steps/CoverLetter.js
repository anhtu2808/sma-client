import React from 'react';
import { Modal } from 'antd';
import { Edit3, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import SimpleTextEditor from '@/components/SimpleTextEditor';
import StepWrapper from './StepWrapper';
import { useGenerateCoverLetterMutation } from '@/apis/applicationApi';

const stripHtml = (html) => (html || '').replace(/<[^>]*>/g, '').trim();

const CoverLetter = ({ contactInfo, onChange, stepNumber, jobId, selectedResumeId }) => {
    const [generateCoverLetter, { isLoading: isGenerating }] = useGenerateCoverLetterMutation();
    const canGenerate = Boolean(jobId) && Boolean(selectedResumeId) && !isGenerating;

    const runGenerate = async () => {
        try {
            const text = await generateCoverLetter({
                jobId: parseInt(jobId, 10),
                resumeId: selectedResumeId,
            }).unwrap();

            if (!text) {
                toast.error('AI returned an empty cover letter. Please try again.');
                return;
            }

            onChange({ target: { name: 'coverLetter', value: text } });
            toast.success('Cover letter drafted by AI. Review and edit before submitting.');
        } catch (err) {
            const message =
                err?.data?.message ||
                (err?.status === 403
                    ? "You've reached the AI cover letter usage limit. Please upgrade your plan."
                    : 'AI failed to generate the cover letter. Please try again.');
            toast.error(message);
        }
    };

    const handleAiClick = () => {
        if (!canGenerate) return;
        const hasExisting = stripHtml(contactInfo.coverLetter).length > 0;
        if (hasExisting) {
            Modal.confirm({
                title: 'Replace your current cover letter?',
                content: 'AI will overwrite the content currently in the editor. This cannot be undone.',
                okText: 'Replace',
                cancelText: 'Cancel',
                onOk: runGenerate,
            });
            return;
        }
        runGenerate();
    };

    return (
        <StepWrapper
            icon={<Edit3 size={18} />}
            title="Cover Letter"
            step={stepNumber}
        >
            <div className="mb-3 flex items-center justify-between gap-3 flex-wrap">
                <p className="text-xs text-gray-500">
                    {selectedResumeId
                        ? 'Let AI draft a personalized cover letter from the selected resume and the job description.'
                        : 'Select a resume in step 01 to enable the AI assistant.'}
                </p>
                <button
                    type="button"
                    onClick={handleAiClick}
                    disabled={!canGenerate}
                    className={`group relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200
                        ${canGenerate
                            ? 'text-white bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
                            : 'text-gray-400 bg-gray-100 cursor-not-allowed'}
                    `}
                >
                    {isGenerating ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <Sparkles
                            size={14}
                            className={canGenerate ? 'transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110' : ''}
                        />
                    )}
                    <span>{isGenerating ? 'Drafting…' : 'Write with AI'}</span>
                </button>
            </div>
            <SimpleTextEditor
                value={contactInfo.coverLetter}
                onChange={(html) => onChange({ target: { name: 'coverLetter', value: html } })}
                placeholder="Tell the recruiter why you're the best fit for this role..."
                showCount
                maxLength={5000}
            />
        </StepWrapper>
    );
};

export default CoverLetter;
