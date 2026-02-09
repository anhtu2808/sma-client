
import React, { useState, useRef, useEffect } from 'react';
import Button from '@/components/Button';
import PropTypes from 'prop-types';

const Select = ({
    options,
    value,
    onChange,
    placeholder = "Select option",
    fullWidth = false,
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const selectedOption = options.find(opt =>
        (opt.value === value) || (value === '' && opt.label.startsWith('All'))
    );

    // Fallback if no option matches (e.g. initial state)
    const displayLabel = selectedOption ? selectedOption.label : (value || placeholder);

    return (
        <div className={`relative ${fullWidth ? 'w-full' : 'inline-block'} ${className}`} ref={dropdownRef}>
            <Button
                fullWidth={fullWidth}
                mode="secondary"
                onClick={() => setIsOpen(!isOpen)}
                className={`!justify-between !px-4 !py-3 h-auto !bg-slate-50 dark:!bg-[#3d241b] !border-slate-200 dark:!border-[#4b2c20] !rounded-xl transition-all font-medium ${isOpen ? '!ring-2 !ring-primary/20 !border-primary' : ''}`}
                iconRight={
                    <span className={`material-icons-round text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        keyboard_arrow_down
                    </span>
                }
            >
                <span className={`truncate text-base normal-case font-medium ${!value ? 'text-slate-700 dark:text-gray-300' : 'text-slate-900 dark:text-white'}`}>
                    {displayLabel || placeholder}
                </span>
            </Button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#2c1a14] border border-slate-100 dark:border-[#4b2c20] rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
                    <ul className="p-1">
                        {options.map((opt) => {
                            const isSelected = opt.value === value || (value === '' && opt.label.startsWith('All'));
                            return (
                                <li key={opt.label || opt.value}>
                                    <Button
                                        fullWidth
                                        mode="ghost"
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                        }}
                                        className={`!justify-between !px-4 !py-2.5 !h-auto !text-sm !font-normal !rounded-lg group
                                            ${isSelected
                                                ? '!bg-primary !text-white !font-medium'
                                                : 'text-slate-700 dark:text-gray-200 hover:!bg-orange-50 dark:hover:!bg-[#3d241b] hover:!text-primary'
                                            }`}
                                        iconRight={isSelected && <span className="material-icons-round text-sm">check</span>}
                                    >
                                        <span className="truncate">{opt.label}</span>
                                    </Button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

Select.propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired
    })).isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    fullWidth: PropTypes.bool,
    className: PropTypes.string
};

export default Select;
