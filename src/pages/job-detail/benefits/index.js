import React from 'react';

const Benefits = ({ benefits }) => {
    if (!benefits || benefits.length === 0) return null;

    return (
        <div className="p-6 md:p-8">
            <h3 className="text-gray-900 text-lg font-bold mb-4">Benefits & Perks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                    <div key={benefit.id} className="flex items-start gap-3">
                        <span className="material-icons-round text-primary text-[20px]">verified</span>
                        <div>
                            <p className="font-semibold text-gray-900">{benefit.name}</p>
                            {benefit.description && <p className="text-sm text-gray-500">{benefit.description}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Benefits;
