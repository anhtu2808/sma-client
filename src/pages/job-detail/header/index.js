import React from 'react';

const Header = ({ job }) => {
    return (
        <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-gray-900 text-2xl md:text-3xl font-bold leading-tight">{job.name}</h1>
            <button className="hidden sm:flex size-10 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-primary hover:border-primary transition-colors shrink-0">
                <span className="material-icons-round">bookmark_border</span>
            </button>
        </div>
    );
};

export default Header;
