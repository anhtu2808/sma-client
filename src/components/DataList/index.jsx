
import React from 'react';
import PropTypes from 'prop-types';
import Loading from '@/components/Loading';

const DataList = ({
    isLoading,
    isError,
    data,
    emptyMessage = "No items found",
    emptySubMessage = "Try adjusting your search criteria or filters.",
    children,
    className = ""
}) => {
    // 1. Loading State
    if (isLoading) {
        return (
            <Loading className={className} size={110} />
        );
    }

    // 2. Error State
    if (isError) {
        return (
            <div className={`text-center py-20 bg-white dark:bg-[#2c1a14] rounded-2xl border border-red-100 ${className}`}>
                <p className="text-red-500 font-medium">Failed to load data. Please try again later.</p>
            </div>
        );
    }

    // 3. Empty State
    if (!data || data.length === 0) {
        return (
            <div className={`text-center py-20 bg-white dark:bg-[#2c1a14] rounded-2xl border border-slate-100 dark:border-[#3d241b] ${className}`}>
                <span className="material-icons-round text-6xl text-slate-200 dark:text-slate-700 mb-4">search_off</span>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{emptyMessage}</h3>
                <p className="text-slate-500 dark:text-slate-400">{emptySubMessage}</p>
            </div>
        );
    }

    // 4. Content
    return (
        <div className={`flex-1 ${className}`}>
            {children}
        </div>
    );
};

DataList.propTypes = {
    isLoading: PropTypes.bool,
    isError: PropTypes.bool,
    data: PropTypes.array,
    emptyMessage: PropTypes.string,
    emptySubMessage: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string
};

export default DataList;
