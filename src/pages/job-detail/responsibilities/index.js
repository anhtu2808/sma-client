import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetJobByIdQuery } from '@/apis/jobApi';

const Responsibilities = () => {
    const { id } = useParams();
    const { data: jobData } = useGetJobByIdQuery(id);
    const responsibilitiesRaw = jobData?.data?.responsibilities;

    if (!responsibilitiesRaw) return null;

    return (
        <div className="p-6 md:p-8">
            <h3 className="text-gray-900 text-lg font-bold mb-4">Responsibilities</h3>
            <div
                className="job-detail-content text-gray-600 text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: responsibilitiesRaw }}
            />
        </div>
    );
};

export default Responsibilities;
