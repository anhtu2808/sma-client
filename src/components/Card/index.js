import React from 'react';

const Card = ({ children, className = '', title, featured = false }) => {
    return (
        <div className={`
            bg-white dark:bg-surface-dark rounded-2xl p-6 
            ${featured 
                ? 'border-2 border-primary/20 hover:border-primary' 
                : 'border border-neutral-200 dark:border-neutral-700'
            }
            hover:shadow-lg transition-all duration-300
            ${className}
        `}>
            {title && (
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 font-heading">
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
};

export default Card;
