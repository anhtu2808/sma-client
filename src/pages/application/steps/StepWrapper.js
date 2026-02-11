import React from 'react';

const StepWrapper = ({ icon, title, step, children }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 text-gray-600">
                    {icon}
                </div>
                <div className="flex items-center gap-3 flex-1">
                    <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Step {step}</span>
                </div>
            </div>
            {children}
        </div>
    );
};

export default StepWrapper;
