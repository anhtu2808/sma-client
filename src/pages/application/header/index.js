import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import { useGetJobByIdQuery } from '@/apis/jobApi';
import { useParams } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const { id: jobId } = useParams();
    const { data } = useGetJobByIdQuery(jobId);
    const jobData = data?.data;

    return (
        <>
            <header className="mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-4 group"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-semibold uppercase tracking-widest">Back to Job</span>
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading tracking-tight">
                    Apply for <span className="text-primary">{jobData?.name}</span>
                </h1>
                <p className="text-sm text-gray-500 mt-1">{jobData?.company?.name} • {jobData?.workingModel}</p>
            </header>
            {jobData?.appliedAttempt === 1 && (
                <div className="mb-6 p-5 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4 shadow-sm">
                    <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                    <div className="space-y-1">
                        <h4 className="text-[11px] font-black text-amber-900 uppercase tracking-widest">Final Attempt Notice</h4>
                        <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                            You have **01 final attempt** remaining. Frequent re-applications without significant updates may negatively impact the employer's perception. Please ensure your resume is updated.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
