import React from 'react';
import { Edit3 } from 'lucide-react';
import Input from '@/components/Input';
import StepWrapper from './StepWrapper';

const CoverLetter = ({ contactInfo, onChange, stepNumber }) => {
    return (
        <StepWrapper
            icon={<Edit3 size={18} />}
            title="Cover Letter"
            step={stepNumber}
        >
            <Input.TextArea
                name="coverLetter"
                value={contactInfo.coverLetter}
                onChange={onChange}
                placeholder="Tell the recruiter why you're the best fit for this role..."
                rows={6}
                className="!rounded-2xl"
            />
        </StepWrapper>
    );
};

export default CoverLetter;
