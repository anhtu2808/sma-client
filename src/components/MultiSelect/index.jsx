
import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const MultiSelect = ({
    options = [],
    value = [],
    onChange,
    onSearch,
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    fullWidth = false,
    className = "",
    loading = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    // Debounced search
    useEffect(() => {
        if (!onSearch) return;
        const timer = setTimeout(() => {
            onSearch(searchText);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchText, onSearch]);

    const handleToggle = useCallback((optionValue) => {
        const isSelected = value.includes(optionValue);
        const newValue = isSelected
            ? value.filter(v => v !== optionValue)
            : [...value, optionValue];
        onChange(newValue);
    }, [value, onChange]);

    const handleRemoveTag = useCallback((optionValue, e) => {
        e.stopPropagation();
        onChange(value.filter(v => v !== optionValue));
    }, [value, onChange]);

    // Map value IDs to labels for tags
    const selectedOptions = value
        .map(v => options.find(opt => opt.value === v))
        .filter(Boolean);

    return (
        <div
            className={`relative ${fullWidth ? 'w-full' : 'inline-block'} ${className}`}
            ref={containerRef}
        >
            {/* Trigger */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex flex-wrap items-center gap-1.5 min-h-[46px] px-3 py-2 cursor-pointer
                    bg-slate-50 dark:bg-[#3d241b] border rounded-xl transition-all
                    ${isOpen
                        ? 'ring-2 ring-primary/20 border-primary'
                        : 'border-slate-200 dark:border-[#4b2c20] hover:border-slate-300 dark:hover:border-[#5a3628]'
                    }
                `}
            >
                {selectedOptions.length > 0 ? (
                    selectedOptions.map(opt => (
                        <span
                            key={opt.value}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-primary/10 text-primary border border-primary/20"
                        >
                            {opt.label}
                            <button
                                type="button"
                                onClick={(e) => handleRemoveTag(opt.value, e)}
                                className="ml-0.5 hover:text-red-500 transition-colors rounded-full"
                            >
                                <span className="material-icons-round" style={{ fontSize: '14px' }}>close</span>
                            </button>
                        </span>
                    ))
                ) : (
                    <span className="text-sm text-slate-400 dark:text-slate-500 select-none">
                        {placeholder}
                    </span>
                )}

                {/* Arrow */}
                <span
                    className={`material-icons-round text-slate-400 ml-auto transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                >
                    keyboard_arrow_down
                </span>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#2c1a14] border border-slate-100 dark:border-[#4b2c20] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    {/* Search input */}
                    <div className="p-2 border-b border-slate-100 dark:border-[#3d241b]">
                        <div className="relative">
                            <span className="material-icons-round absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                                search
                            </span>
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder={searchPlaceholder}
                                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-[#4b2c20] rounded-lg bg-slate-50 dark:bg-[#3d241b] text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                            />
                        </div>
                    </div>

                    {/* Options list */}
                    <ul className="p-1 max-h-[220px] overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <li className="px-4 py-3 text-sm text-slate-400 text-center">Loading...</li>
                        ) : options.length === 0 ? (
                            <li className="px-4 py-3 text-sm text-slate-400 text-center">No results found</li>
                        ) : (
                            options.map(opt => {
                                const isSelected = value.includes(opt.value);
                                return (
                                    <li key={opt.value}>
                                        <button
                                            type="button"
                                            onClick={() => handleToggle(opt.value)}
                                            className={`
                                                w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors text-left
                                                ${isSelected
                                                    ? 'bg-primary/5 text-primary font-medium'
                                                    : 'text-slate-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-[#3d241b]'
                                                }
                                            `}
                                        >
                                            {/* Checkbox */}
                                            <div className={`
                                                w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded border flex items-center justify-center transition-colors
                                                ${isSelected
                                                    ? 'bg-primary border-primary'
                                                    : 'border-slate-300 dark:border-[#4b2c20] bg-white dark:bg-[#2c1a14]'
                                                }
                                            `}>
                                                {isSelected && (
                                                    <span className="material-icons-round text-white" style={{ fontSize: '14px' }}>check</span>
                                                )}
                                            </div>
                                            <span className="truncate">{opt.label}</span>
                                        </button>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

MultiSelect.propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
    })).isRequired,
    value: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func,
    placeholder: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
    loading: PropTypes.bool,
};

export default MultiSelect;
