import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetJobByIdQuery } from '@/apis/jobApi';
import { JOB_LEVEL_LABELS } from '@/constant';

const MetaInfo = () => {
    const { id } = useParams();
    const { data: jobData } = useGetJobByIdQuery(id);
    const apiJob = jobData?.data;

    if (!apiJob) return null;

    // Formatting logic
    const location = apiJob.workingModel || apiJob.company?.country || "Remote";
    const salaryFormatted = apiJob.salaryStart && apiJob.salaryEnd
        ? `${new Intl.NumberFormat('vi-VN').format(apiJob.salaryStart)} - ${new Intl.NumberFormat('vi-VN').format(apiJob.salaryEnd)} ${apiJob.currency || 'VND'}`
        : "Negotiable";
    const experienceTime = apiJob.experienceTime ? `${apiJob.experienceTime} years` : null;
    const expDate = apiJob.expDate ? new Date(apiJob.expDate).toLocaleDateString() : null;

    return (
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
                <span className="material-icons-round text-gray-400 text-[20px]">location_on</span>
                <span>{apiJob.company?.country || location}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="material-icons-round text-gray-400 text-[20px]">payments</span>
                <span className="font-semibold text-primary">{salaryFormatted}</span>
            </div>
            {experienceTime && (
                <div className="flex items-center gap-2">
                    <span className="material-icons-round text-gray-400 text-[20px]">work_history</span>
                    <span>{experienceTime} experience</span>
                </div>
            )}
            <div className="flex items-center gap-2">
                <span className="material-icons-round text-gray-400 text-[20px]">business_center</span>
                <span>{JOB_LEVEL_LABELS[apiJob.jobLevel] || apiJob.jobLevel}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="material-icons-round text-gray-400 text-[20px]">apartment</span>
                <span>{apiJob.workingModel}</span>
            </div>
            {expDate && (
                <div className="flex items-center gap-2">
                    <span className="material-icons-round text-gray-400 text-[20px]">event</span>
                    <span>Deadline: {expDate}</span>
                </div>
            )}
        </div>
    );
};

export default MetaInfo;
