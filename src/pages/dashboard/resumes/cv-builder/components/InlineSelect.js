import React, { useState, useRef, useEffect } from 'react';

/**
 * InlineSelect - A click-to-edit select that looks like text on the CV.
 * On click it opens a small dropdown. Hidden on print.
 * 
 * Props:
 * - value: current selected value (e.g., "ONSITE")
 * - options: array of { label, value }
 * - onChange: callback with new value
 * - className: optional className for the displayed text
 * - placeholder: optional placeholder text
 */
const InlineSelect = ({ value, options = [], onChange, className = '', placeholder = 'Select...' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const displayLabel = options.find(o => o.value === value)?.label || value || placeholder;

    return (
        <span
            ref={containerRef}
            className="relative inline-block print:static"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Display text - clickable */}
            <span
                onClick={() => setIsOpen(!isOpen)}
                className={`cursor-pointer hover:bg-blue-50 hover:text-blue-600 px-1 py-0.5 rounded transition-colors print:p-0 print:hover:bg-transparent ${className}`}
                title="Click to change"
            >
                {displayLabel}
            </span>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px] py-1 print:hidden">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer ${
                                value === opt.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </span>
    );
};

export default InlineSelect;
