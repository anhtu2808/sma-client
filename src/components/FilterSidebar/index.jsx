
import React from 'react';
import Button from '@/components/Button';
import PropTypes from 'prop-types';

const FilterSidebar = ({
    title = "Filters",
    onReset,
    children,
    className = ""
}) => {
    return (
        <aside className={`lg:w-1/4 shrink-0 space-y-6 ${className}`}>
            <div className="bg-white dark:bg-[#2c1a14] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-[#3d241b] sticky top-24">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <span className="material-icons-round text-primary">filter_list</span>
                        {title}
                    </h2>
                    {onReset && (
                        <Button
                            mode="ghost"
                            size="sm"
                            onClick={onReset}
                            className="!text-sm !text-primary !font-medium hover:!underline !p-0 !min-h-0 !h-auto hover:!bg-transparent"
                        >
                            Reset
                        </Button>
                    )}
                </div>

                {children}
            </div>
        </aside>
    );
};

FilterSidebar.propTypes = {
    title: PropTypes.string,
    onReset: PropTypes.func,
    children: PropTypes.node,
    className: PropTypes.string
};

export default FilterSidebar;
