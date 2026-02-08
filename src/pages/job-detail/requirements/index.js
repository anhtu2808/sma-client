import React from 'react';

const Requirements = ({ requirements }) => {
    if (!requirements || requirements.length === 0) return null;

    return (
        <div className="p-6 md:p-8 border-b border-gray-100">
            <h3 className="text-gray-900 text-lg font-bold mb-4">Requirements</h3>
            <ul className="space-y-3">
                {requirements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-600">
                        <span className="material-icons-round text-green-500 text-[18px] mt-0.5">task_alt</span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Requirements;
