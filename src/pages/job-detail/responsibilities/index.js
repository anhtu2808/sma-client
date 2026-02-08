import React from 'react';

const Responsibilities = ({ responsibilities }) => {
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
