import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetJobByIdQuery } from '@/apis/jobApi';
import { JOB_LEVEL_LABELS, WORKING_MODEL_LABELS } from '@/constant';
import { formatSalary } from '@/utils/salaryUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faCalendar, faCity, faClockRotateLeft, faCreditCard, faLocationDot, faUsers } from '../../../utils/icons';

const MetaInfo = () => {
    const { id } = useParams();
    const { data: jobData } = useGetJobByIdQuery(id);
    const apiJob = jobData?.data;

    if (!apiJob) return null;

    // Formatting logic
    const location = apiJob.workingModel || apiJob.company?.country || "Remote";
    const salaryFormatted = formatSalary(apiJob.salaryStart, apiJob.salaryEnd);
    const experienceTime = apiJob.experienceTime ? `${apiJob.experienceTime} years` : null;
    const expDate = apiJob.expDate ? new Date(apiJob.expDate).toLocaleDateString() : null;

    return (
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faLocationDot} className="text-gray-400 text-[20px]" />
                <span>{apiJob.company?.country || location}</span>
            </div>
            <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCreditCard} className="text-gray-400 text-[20px]" />
                <span className="font-semibold text-primary">{salaryFormatted}</span>
            </div>
            {experienceTime && (
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faClockRotateLeft} className="text-gray-400 text-[20px]" />
                    <span>{experienceTime} experience</span>
                </div>
            )}
            <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faBriefcase} className="text-gray-400 text-[20px]" />
                <span>{JOB_LEVEL_LABELS[apiJob.jobLevel] || apiJob.jobLevel}</span>
            </div>
            <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCity} className="text-gray-400 text-[20px]" />
                <span>{WORKING_MODEL_LABELS[apiJob.workingModel] || apiJob.workingModel}</span>
            </div>
            {apiJob.quantity > 0 && (
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faUsers} className="text-gray-400 text-[20px]" />
                    <span>{apiJob.quantity} positions</span>
                </div>
            )}
            {expDate && (
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendar} className="text-gray-400 text-[20px]" />
                    <span>Deadline: {expDate}</span>
                </div>
            )}
        </div>
    );
};

export default MetaInfo;
