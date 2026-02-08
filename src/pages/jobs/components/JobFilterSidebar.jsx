import React from 'react';
import Select from '@/components/Select';
import FilterSidebar from '@/components/FilterSidebar';

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
        <FilterSidebar title="Filters" onReset={onReset}>
            {/* Location - Dropdown Style */}
            <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Location</label>
                <Select
                    options={locationOptions}
                    value={filters.location}
                    onChange={(val) => onFilterChange('location', val)}
                    placeholder="Select Location"
                    fullWidth
                />
            </div>

            {/* Job Level - Dropdown Style */}
            <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Job Level</label>
                <Select
                    options={jobTypeOptions}
                    value={filters.jobLevel}
                    onChange={(val) => onFilterChange('jobLevel', val)}
                    placeholder="Select Job Level"
                    fullWidth
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
        </FilterSidebar>
    );
};

export default JobFilterSidebar;