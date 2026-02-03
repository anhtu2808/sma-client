import React, { useState, useRef, useEffect } from 'react';

// Custom Dropdown Component
const CustomDropdown = ({ options, value, onChange, placeholder = "Select option" }) => {
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
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full text-left bg-slate-50 dark:bg-[#3d241b] border border-slate-200 dark:border-[#4b2c20] py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium flex items-center justify-between ${isOpen ? 'ring-2 ring-primary/20 border-primary' : ''}`}
            >
                <span className={`truncate ${!value ? 'text-slate-700 dark:text-gray-300' : 'text-slate-900 dark:text-white'}`}>
                    {displayLabel || placeholder}
                </span>
                <span className={`material-icons-round text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    keyboard_arrow_down
                </span>
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#2c1a14] border border-slate-100 dark:border-[#4b2c20] rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
                    <ul className="p-1">
                        {options.map((opt) => {
                            const isSelected = opt.value === value || (value === '' && opt.label.startsWith('All'));
                            return (
                                <li key={opt.label}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between group rounded-lg
                                            ${isSelected
                                                ? 'bg-primary text-white font-medium'
                                                : 'text-slate-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-[#3d241b] hover:text-primary'
                                            }`}
                                    >
                                        <span>{opt.label}</span>
                                        {isSelected && (
                                            <span className="material-icons-round text-sm">check</span>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

const JobFilterSidebar = ({ filters, onFilterChange, onReset }) => {
    // Static data transformed for CustomDropdown
    const locationOptions = [
        { label: "All Cities", value: "" },
        { label: "Ha Noi", value: "Ha Noi" },
        { label: "Ho Chi Minh City", value: "Ho Chi Minh City" },
        { label: "Da Nang", value: "Da Nang" },
        { label: "Remote", value: "Remote" }
    ];

    const jobTypeOptions = [
        { label: "All Levels", value: "" },
        { label: "Intern", value: "INTERN" },
        { label: "Junior", value: "JUNIOR" },
        { label: "Middle", value: "MIDDLE" },
        { label: "Senior", value: "SENIOR" },
        { label: "Lead", value: "LEAD" },
        { label: "Manager", value: "MANAGER" }
    ];

    // Mock Skills
    const skills = [
        { id: 1, name: "Java" },
        { id: 2, name: "ReactJS" },
        { id: 3, name: "NodeJS" },
        { id: 4, name: "Python" },
        { id: 5, name: ".NET" },
        { id: 6, name: "Angular" },
        { id: 7, name: "VueJS" },
        { id: 8, name: "Go" },
        { id: 9, name: "AWS" },
        { id: 10, name: "Docker" },
    ];

    const handleSkillChange = (skillId) => {
        const currentSkills = filters.skillId || [];
        const isSelected = currentSkills.includes(skillId);

        let newSkills;
        if (isSelected) {
            newSkills = currentSkills.filter(id => id !== skillId);
        } else {
            newSkills = [...currentSkills, skillId];
        }

        onFilterChange('skillId', newSkills);
    };

    return (
        <aside className="lg:w-1/4 shrink-0 space-y-6">
            <div className="bg-white dark:bg-[#2c1a14] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-[#3d241b] sticky top-24">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <span className="material-icons-round text-primary">filter_list</span>
                        Filters
                    </h2>
                    <button
                        onClick={onReset}
                        className="text-sm text-primary font-medium hover:underline"
                    >
                        Reset
                    </button>
                </div>

                {/* Location - Dropdown Style */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Location</label>
                    <CustomDropdown
                        options={locationOptions}
                        value={filters.location}
                        onChange={(val) => onFilterChange('location', val)}
                        placeholder="Select Location"
                    />
                </div>

                {/* Job Level - Dropdown Style */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Job Level</label>
                    <CustomDropdown
                        options={jobTypeOptions}
                        value={filters.jobLevel}
                        onChange={(val) => onFilterChange('jobLevel', val)}
                        placeholder="Select Job Level"
                    />
                </div>

                {/* Skills - Multi-select Checkboxes */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Skills</label>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {skills.map(skill => {
                            const isChecked = (filters.skillId || []).includes(skill.id);
                            return (
                                <label key={skill.id} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-slate-50 dark:hover:bg-[#3d241b] rounded-lg transition-colors">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-primary border-primary' : 'border-slate-300 dark:border-[#4b2c20] bg-white dark:bg-[#2c1a14]'}`}>
                                        {isChecked && <span className="material-icons-round text-white text-xs">check</span>}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={isChecked}
                                        onChange={() => handleSkillChange(skill.id)}
                                    />
                                    <span className={`text-sm ${isChecked ? 'font-bold text-primary' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'}`}>
                                        {skill.name}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </div>

            </div>
        </aside>
    );
};

export default JobFilterSidebar;