import React, { useState, useCallback } from 'react';
import Select from '@/components/Select';
import MultiSelect from '@/components/MultiSelect';
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
    const { data: skills = [], isFetching: isLoadingSkills } = useGetSkillsQuery({ name: skillSearch || undefined, page: 0, size: 100 });

    // Transform skills to options format
    const skillOptions = skills.map(skill => ({
        label: skill.name,
        value: skill.id,
    }));

    const handleSkillSearchChange = useCallback((search) => {
        setSkillSearch(search);
    }, []);

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

            {/* Skills - Multi-select Dropdown */}
            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Skills</label>
                <MultiSelect
                    options={skillOptions}
                    value={filters.skillId || []}
                    onChange={(newSkills) => onFilterChange('skillId', newSkills)}
                    onSearch={handleSkillSearchChange}
                    placeholder="Select skills..."
                    searchPlaceholder="Search skills..."
                    loading={isLoadingSkills}
                    fullWidth
                />
            </div>
        </FilterSidebar>
    );
};

export default Sidebar;