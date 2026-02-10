import React from 'react';
import Button from '@/components/Button';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const CTAButtons = ({ job }) => {
    const navigate = useNavigate();
    console.log("Dữ liệu job tại UI:", job);
    const attempt = job?.appliedAttempt || 0;
    const canApply = job?.canApply;
    const lastStatus = job?.lastApplicationStatus;

    const getButtonConfig = () => {
        if (attempt >= 2 || canApply === false) {
            return {
                text: "Max Attempts Reached",
                disabled: true,
                mode: "secondary",
                note: "You have reached the limit of 2 applications for this job."
            };
        }
        if (attempt > 0 && lastStatus !== 'APPLIED') {
            return {
                text: "APPLICATION IN PROCESSED",
                disabled: true,
                mode: "secondary",
                note: "Your application is currently being processed and cannot be edited."
            };
        }
        if (attempt === 1) {
            return { text: "Re-apply (2/2)", disabled: false, mode: "primary" };
        }

        return { text: "Apply Now", disabled: false, mode: "primary" };
    };

    const config = getButtonConfig();

    if (!job?.id) return <div className="animate-spin h-12 bg-gray-200 rounded-xl mt-6" />;

    return (
        <div className="mt-6 pt-6 border-t border-gray-100 font-body space-y-3">
            {attempt === 1 && !config.disabled && (
                <div className="mb-6 p-5 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
                    <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                    <div className="space-y-1.5">
                        <h4 className="text-[11px] font-black text-amber-900 uppercase tracking-widest">
                            Re-application Notice
                        </h4>
                        <p className="text-[10px] text-amber-700 leading-relaxed font-medium italic">
                            You have **01 final attempt** remaining for this position. Please note that frequent re-applications without significant profile updates may negatively impact the employer's perception of your candidacy. We highly recommend reviewing your resume and answers before proceeding.
                        </p>
                    </div>
                </div>
            )}
            <div className="flex flex-row gap-3">
                <div className="flex-1">
                    <Button
                        mode={config.mode}
                        fullWidth
                        disabled={config.disabled}
                        shape='rounded'
                        onClick={() => navigate(`/applications/apply/${job.id}`)}
                        iconRight={!config.disabled && <span className="material-icons-round text-[20px]">arrow_outward</span>}
                    >
                        {config.text}
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

        </div>
    );
};

export default CTAButtons;