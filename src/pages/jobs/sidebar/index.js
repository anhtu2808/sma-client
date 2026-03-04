import React, { useState, useEffect, useCallback } from 'react';
import { Slider, Select } from 'antd';
import FilterSidebar from '@/components/FilterSidebar';
import { useGetSkillsQuery } from '@/apis/skillApi';
import { useGetExpertisesQuery } from '@/apis/expertiseApi';
import { useGetDomainsQuery } from '@/apis/domainApi';
import { locationOptions, jobLevelOptions, workingModelOptions } from '@/constant';

const Sidebar = ({ filters, onFilterChange, onReset, isLoading }) => {
    const [salaryRange, setSalaryRange] = useState([0, 100]);
    const [experienceRange, setExperienceRange] = useState([0, 10]);

    const [skillSearch, setSkillSearch] = useState('');
    const [expertiseSearch, setExpertiseSearch] = useState('');
    const [domainSearch, setDomainSearch] = useState('');

    const { data: skills = [], isFetching: isLoadingSkills } = useGetSkillsQuery({ name: skillSearch || undefined, page: 0, size: 100 });
    const { data: expertises = [], isFetching: isLoadingExpertises } = useGetExpertisesQuery({ name: expertiseSearch || undefined, page: 0, size: 100 });
    const { data: domains = [], isFetching: isLoadingDomains } = useGetDomainsQuery({ query: domainSearch || undefined, page: 0, size: 100 });

    const skillOptions = skills.map(s => ({ label: s.name, value: s.id }));
    const expertiseOptions = expertises.map(e => ({ label: e.name, value: e.id }));
    const domainOptions = domains.map(d => ({ label: d.name, value: d.id }));

    useEffect(() => {
        const min = filters.salaryStart ? Math.floor(filters.salaryStart / 1000000) : 0;
        const max = filters.salaryEnd ? Math.floor(filters.salaryEnd / 1000000) : 100;
        setSalaryRange([min, max]);
    }, [filters.salaryStart, filters.salaryEnd]);

    useEffect(() => {
        setExperienceRange([filters.minExperienceTime || 0, filters.maxExperienceTime || 10]);
    }, [filters.minExperienceTime, filters.maxExperienceTime]);

    const handleSalaryChange = useCallback((value) => {
        setSalaryRange(value);
        const [min, max] = value;
        onFilterChange('salaryStart', min > 0 ? min * 1000000 : '');
        onFilterChange('salaryEnd', max < 100 ? max * 1000000 : '');
    }, [onFilterChange]);

    const handleExperienceChange = useCallback((value) => {
        setExperienceRange(value);
        const [min, max] = value;
        onFilterChange('minExperienceTime', min > 0 ? min : '');
        onFilterChange('maxExperienceTime', max < 10 ? max : '');
    }, [onFilterChange]);

    const handleSkillSearch = useCallback((val) => setSkillSearch(val), []);
    const handleExpertiseSearch = useCallback((val) => setExpertiseSearch(val), []);
    const handleDomainSearch = useCallback((val) => setDomainSearch(val), []);

    return (
        <FilterSidebar title="Filters" onReset={onReset}>
            {/* Location */}
            <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Location</label>
                <Select
                    showSearch
                    allowClear
                    options={locationOptions}
                    value={filters.location || undefined}
                    onChange={(val) => onFilterChange('location', val ?? '')}
                    placeholder="Select Location"
                    className="w-full"
                    filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                    loading={isLoading}
                />
            </div>

            {/* Job Level */}
            <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Job Level</label>
                <Select
                    showSearch
                    allowClear
                    options={jobLevelOptions}
                    value={filters.jobLevel || undefined}
                    onChange={(val) => onFilterChange('jobLevel', val ?? '')}
                    placeholder="Select Job Level"
                    className="w-full"
                    filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                    loading={isLoading}
                />
            </div>

            {/* Working Model */}
            <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Working Model</label>
                <Select
                    showSearch
                    allowClear
                    options={workingModelOptions}
                    value={filters.workingModel || undefined}
                    onChange={(val) => onFilterChange('workingModel', val ?? '')}
                    placeholder="Select Working Model"
                    className="w-full"
                    filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                    loading={isLoading}
                />
            </div>

            {/* Skills */}
            <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Skills</label>
                <Select
                    mode="multiple"
                    showSearch
                    allowClear
                    options={skillOptions}
                    value={filters.skillId || []}
                    onChange={(val) => onFilterChange('skillId', val)}
                    onSearch={handleSkillSearch}
                    placeholder="Select skills..."
                    loading={isLoadingSkills}
                    className="w-full"
                    filterOption={false}
                    disabled={isLoading}
                />
            </div>

            {/* Salary Range */}
            <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                    Salary Range (VND)
                    <span className="ml-2 text-xs font-normal text-slate-500">
                        {salaryRange[0] === 0 ? '0' : `${salaryRange[0]}M`} - {salaryRange[1] === 100 ? '100M+' : `${salaryRange[1]}M`}
                    </span>
                </label>
                <Slider
                    range
                    min={0}
                    max={100}
                    step={5}
                    value={salaryRange}
                    onChange={setSalaryRange}
                    onChangeComplete={handleSalaryChange}
                    tooltip={{ formatter: (v) => `${v}M` }}
                    disabled={isLoading}
                />
            </div>

            {/* Experience */}
            <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                    Experience (Years)
                    <span className="ml-2 text-xs font-normal text-slate-500">
                        {experienceRange[0]} - {experienceRange[1] === 10 ? '10+' : experienceRange[1]} years
                    </span>
                </label>
                <Slider
                    range
                    min={0}
                    max={10}
                    step={1}
                    value={experienceRange}
                    onChange={setExperienceRange}
                    onChangeComplete={handleExperienceChange}
                    tooltip={{ formatter: (v) => `${v} yr` }}
                    disabled={isLoading}
                />
            </div>

            {/* Expertise */}
            <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Expertise</label>
                <Select
                    mode="multiple"
                    showSearch
                    allowClear
                    options={expertiseOptions}
                    value={filters.expertiseId || []}
                    onChange={(val) => onFilterChange('expertiseId', val)}
                    onSearch={handleExpertiseSearch}
                    placeholder="Select expertises..."
                    loading={isLoadingExpertises}
                    className="w-full"
                    filterOption={false}
                    disabled={isLoading}
                />
            </div>

            {/* Domain */}
            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Domain</label>
                <Select
                    mode="multiple"
                    showSearch
                    allowClear
                    options={domainOptions}
                    value={filters.domainId || []}
                    onChange={(val) => onFilterChange('domainId', val)}
                    onSearch={handleDomainSearch}
                    placeholder="Select domains..."
                    loading={isLoadingDomains}
                    className="w-full"
                    filterOption={false}
                    disabled={isLoading}
                />
            </div>
        </FilterSidebar>
    );
};

export default Sidebar;
