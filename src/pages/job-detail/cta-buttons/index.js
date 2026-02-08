import React from 'react';
import Button from '@/components/Button';

const CTAButtons = ({ jobId }) => {
    return (
        <div className="flex flex-row gap-3 mt-6 pt-6 border-t border-gray-100">
            <div className="flex-1">
                <Button
                    mode="primary"
                    fullWidth
                    className="h-12"
                    shape='rounded'
                    iconRight={<span className="material-icons-round text-[20px]">arrow_outward</span>}
                >
                    Apply Now
                </Button>
            </div>
            <div className="flex-2">
                <Button
                    mode="secondary"
                    fullWidth
                    className="h-12"
                    shape='rounded'
                    iconRight={<span className="material-icons-round text-[20px]">auto_awesome</span>}
                >
                    Check Match
                </Button>
            </div>
        </div>
    );
};

export default CTAButtons;
