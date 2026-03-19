import React from 'react';
import { Edit3 } from 'lucide-react';
import SimpleTextEditor from '@/components/SimpleTextEditor';
import StepWrapper from './StepWrapper';

const CoverLetter = ({ contactInfo, onChange, stepNumber }) => {
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
            />
        </StepWrapper>
    );
};

export default CoverLetter;
