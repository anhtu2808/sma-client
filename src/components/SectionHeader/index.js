import React from 'react';

const SectionHeader = ({ number, title }) => {
    return (
        <div className="flex items-center gap-4 mb-8 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                {number}
            </span>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white font-heading">
                {title}
            </h2>
        </div>
    );
};

export default SectionHeader;
