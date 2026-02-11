import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import Button from '@/components/Button';

const SubmitCTA = ({ isApplying }) => {
    return (
        <div className="pt-6 border-t border-gray-100">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 mb-6">
                <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={18} />
                <p className="text-xs font-medium text-gray-600 leading-relaxed">
                    By submitting this application, you agree to share your profile details and selected resume with the hiring team.
                </p>
            </div>
            <Button
                mode="primary"
                fullWidth
                type="submit"
                disabled={isApplying}
            >
                {isApplying ? (
                    <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Submitting...</span>
                ) : "Submit Application"}
            </Button>
        </div>
    );
};

export default SubmitCTA;
