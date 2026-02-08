
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/Button';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    className = ""
}) => {
    // Generate page numbers
    const pages = [];

    // Always show first page
    pages.push(1);

    // Logic for dots and middle pages
    if (currentPage > 3) {
        pages.push('...');
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
    }

    if (currentPage < totalPages - 2) {
        pages.push('...');
    }

    // Always show last page if more than 1 page
    if (totalPages > 1) {
        pages.push(totalPages);
    }

    // If total pages is small (e.g. < 6), just show all
    if (totalPages <= 6) {
        // CLEAR array and refill
        pages.length = 0;
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    }

    return (
        <div className={`flex items-center justify-center gap-2 ${className}`}>
            {/* Previous Button */}
            <Button
                mode="secondary"
                shape="circle"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="!p-2 !w-10 !h-10 !border-slate-200 dark:!border-[#4b2c20] hover:!bg-slate-50 dark:hover:!bg-[#3d241b]"
            >
                <span className="material-icons-round text-slate-500 dark:text-slate-400">chevron_left</span>
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {pages.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`dots-${index}`} className="w-10 h-10 flex items-center justify-center text-slate-400">
                                ...
                            </span>
                        );
                    }

                    const isActive = page === currentPage;
                    return (
                        <Button
                            key={page}
                            mode={isActive ? 'primary' : 'secondary'}
                            shape="circle"
                            onClick={() => onPageChange(page)}
                            className={`!w-10 !h-10 !font-bold transition-all
                ${isActive
                                    ? 'shadow-lg shadow-primary/30'
                                    : '!border-transparent !bg-transparent text-slate-600 dark:text-slate-400 hover:!bg-slate-100 dark:hover:!bg-[#3d241b]'
                                }
              `}
                        >
                            {page}
                        </Button>
                    );
                })}
            </div>

            {/* Next Button */}
            <Button
                mode="secondary"
                shape="circle"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="!p-2 !w-10 !h-10 !border-slate-200 dark:!border-[#4b2c20] hover:!bg-slate-50 dark:hover:!bg-[#3d241b]"
            >
                <span className="material-icons-round text-slate-500 dark:text-slate-400">chevron_right</span>
            </Button>
        </div>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    className: PropTypes.string
};

export default Pagination;
