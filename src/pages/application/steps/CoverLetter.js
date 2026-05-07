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

    const aiButton = (
        <button
            type="button"
            onClick={handleAiClick}
            disabled={!canGenerate}
            title={selectedResumeId ? 'Draft this cover letter with AI' : 'Select a resume first'}
            className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold transition-all duration-150
                ${canGenerate
                    ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50 active:bg-orange-100'
                    : 'text-gray-400 cursor-not-allowed'}
            `}
        >
            {isGenerating ? (
                <Loader2 size={13} className="animate-spin" />
            ) : (
                <Sparkles
                    size={13}
                    className={canGenerate ? 'transition-transform duration-300 group-hover:rotate-12' : ''}
                />
            )}
            <span>{isGenerating ? 'Drafting…' : 'Write with AI'}</span>
        </button>
    );

    return (
        <StepWrapper
            icon={<Edit3 size={18} />}
            title="Cover Letter"
            step={stepNumber}
        >
            <SimpleTextEditor
                value={contactInfo.coverLetter}
                onChange={(html) => onChange({ target: { name: 'coverLetter', value: html } })}
                placeholder="Tell the recruiter why you're the best fit for this role..."
                showCount
                maxLength={5000}
                toolbarRight={aiButton}
            />
        </StepWrapper>
    );
};

export default CoverLetter;
