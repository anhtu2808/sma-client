import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetJobByIdQuery } from '@/apis/jobApi';

const Requirements = () => {
    const { id } = useParams();
    const { data: jobData } = useGetJobByIdQuery(id);
    const requirementsRaw = jobData?.data?.requirement;

    if (!requirementsRaw) return null;

    return (
        <div className="p-6 md:p-8">
            <h3 className="text-gray-900 text-lg font-bold mb-4">Requirements</h3>
            <div
                className="job-detail-content text-gray-800 text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: requirementsRaw }}
            />
        </div>
    );
};

export default Requirements;
