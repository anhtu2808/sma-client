import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetJobByIdQuery } from '@/apis/jobApi';

const Responsibilities = () => {
    const { id } = useParams();
    const { data: jobData } = useGetJobByIdQuery(id);
    const responsibilitiesRaw = jobData?.data?.responsibilities;

    // Parse list logic
    const parseList = (content) => {
        if (Array.isArray(content)) return content;
        if (typeof content === 'string') {
            return content.split('\n').filter(item => item.trim().length > 0);
        }
        return [];
    };

    const responsibilities = parseList(responsibilitiesRaw);

    if (!responsibilities || responsibilities.length === 0) return null;

    return (
        <div className="p-6 md:p-8 border-b border-gray-100">
            <h3 className="text-gray-900 text-lg font-bold mb-4">Responsibilities</h3>
            <ul className="space-y-3">
                {responsibilities.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-600">
                        <span className="material-icons-round text-primary text-[18px] mt-0.5">check_circle</span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Responsibilities;
