import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '@/components/Card';
import Button from '@/components/Button';

const ApplicationSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const companyName = location.state?.companyName || "the company";

    return (
        <div className="relative min-h-[90vh] flex items-center justify-center bg-[#FCFCFD] overflow-hidden p-6 font-body">
            <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-orange-400/10 rounded-full blur-[80px]" />

            <Card className="relative z-10 max-w-lg w-full !p-12 border border-neutral-100 bg-white/80 backdrop-blur-md shadow-[0_20px_50px_rgba(255,107,53,0.12)] rounded-[2.5rem]">
                <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-8">
                        <div className="absolute inset-0 bg-green-500/15 rounded-full animate-ping" />
                        <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-green-500 to-emerald-400 rounded-full shadow-[0_8px_20px_rgba(16,185,129,0.3)]">
                            <span className="material-icons-round text-white text-5xl">task_alt</span>
                        </div>
                    </div>
                    <h2 className="text-3xl font-extrabold text-neutral-900 mb-4 font-heading tracking-tight italic">
                        Application Submitted!
                    </h2>

                    <div className="space-y-4 text-neutral-600 leading-relaxed">
                        <p className="font-semibold text-neutral-800">
                            You've successfully applied for this position.
                        </p>
                        <p className="text-sm px-4">
                            The recruiter at <span className="text-primary font-bold">{companyName}</span> has received your profile and resume.
                            We will notify you immediately once there is an update on your status.
                        </p>
                    </div>
                    <div className="mt-10 space-y-4">
                        <Button
                            mode="primary"
                            fullWidth
                            onClick={() => navigate('/dashboard/jobs')}
                        >
                            Track My Application
                        </Button>

                        <button
                            onClick={() => navigate('/jobs')}
                            className="flex items-center justify-center gap-2 mx-auto text-[10px] font-black text-gray-400 uppercase hover:text-primary transition-all tracking-[0.2em]"
                        >
                            <span className="material-icons-round text-sm">search</span>
                            Explore More Jobs
                        </button>
                    </div>
                </div>
            </Card>

        </div>
    );
};

export default ApplicationSuccess;
