import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetJobByIdQuery } from '@/apis/jobApi';

const About = () => {
    const { id } = useParams();
    const { data: jobData } = useGetJobByIdQuery(id);
    const description = jobData?.data?.about;

    if (!description) return null; // Or show loading/placeholder

    return (
        <div className="p-6 md:p-8 border-b border-gray-100">
            <h3 className="text-gray-900 text-lg font-bold mb-4">About the Role</h3>
            <div className="text-gray-600 text-base leading-relaxed whitespace-pre-line">
                {description}
            </div>
        </div>
    );
};

export default About;
