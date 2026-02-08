import React from 'react';
import { JOB_LEVEL_LABELS } from '@/constant';

const MetaInfo = ({ job }) => {
    return (
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
                <span className="material-icons-round text-gray-400 text-[20px]">location_on</span>
                <span>{job.companyCountry || job.location}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="material-icons-round text-gray-400 text-[20px]">payments</span>
                <span className="font-semibold text-primary">{job.salaryFormatted}</span>
            </div>
            {job.experienceTime && (
                <div className="flex items-center gap-2">
                    <span className="material-icons-round text-gray-400 text-[20px]">work_history</span>
                    <span>{job.experienceTime} experience</span>
                </div>
            )}
            <div className="flex items-center gap-2">
                <span className="material-icons-round text-gray-400 text-[20px]">business_center</span>
                <span>{JOB_LEVEL_LABELS[job.jobLevel] || job.jobLevel}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="material-icons-round text-gray-400 text-[20px]">apartment</span>
                <span>{job.workingModel}</span>
            </div>
            {job.expDate && (
                <div className="flex items-center gap-2">
                    <span className="material-icons-round text-gray-400 text-[20px]">event</span>
                    <span>Deadline: {job.expDate}</span>
                </div>
            )}
        </div>
    );
};

export default MetaInfo;
