import React, { useState } from 'react';
import Select from '@/components/Select';
import FilterSidebar from '@/components/FilterSidebar';
import { useGetSkillsQuery } from '@/apis/skillApi';

const Sidebar = ({ filters, onFilterChange, onReset }) => {
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

    // Skill search
    const [skillSearch, setSkillSearch] = useState('');

    // Fetch skills from API
    const { data: skills = [] } = useGetSkillsQuery({ name: skillSearch || undefined, page: 0, size: 100 });

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
                <div className="relative mb-3">
                    <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                    <input
                        type="text"
                        value={skillSearch}
                        onChange={(e) => setSkillSearch(e.target.value)}
                        placeholder="Search skills..."
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-[#4b2c20] rounded-lg bg-white dark:bg-[#2c1a14] text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                </div>
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

export default Sidebar;