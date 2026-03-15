import React, { useState, useEffect, useCallback } from 'react';
import { Slider, Radio, Select } from 'antd';
import Input from "@/components/Input";
import FilterSidebar from '@/components/FilterSidebar';
import { useGetSkillsQuery } from '@/apis/skillApi';
import { useGetExpertisesQuery } from '@/apis/expertiseApi';
import { useGetDomainsQuery } from '@/apis/domainApi';
import { jobLevelOptions, workingModelOptions } from '@/constant';

const Sidebar = ({ filters, onFilterChange, onReset, isLoading }) => {
    const [salaryRange, setSalaryRange] = useState([0, 100]);
    const [experienceRange, setExperienceRange] = useState([0, 10]);
    const currency = filters.currency || '';
    const EXCHANGE_RATE = 25000;

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
        if (currency === 'VND') {
            const min = filters.salaryStart ? Math.floor(filters.salaryStart / 1000000) : 0;
            const max = filters.salaryEnd ? Math.floor(filters.salaryEnd / 1000000) : 100;
            setSalaryRange([min, Math.min(max, 100)]);
        } else {
            const min = filters.salaryStart ? Math.floor(filters.salaryStart) : 0;
            const max = filters.salaryEnd ? Math.floor(filters.salaryEnd) : 50000;
            setSalaryRange([min, Math.min(max, 50000)]);
        }
    }, [filters.salaryStart, filters.salaryEnd, currency]);

    useEffect(() => {
        setExperienceRange([filters.minExperienceTime || 0, filters.maxExperienceTime || 10]);
    }, [filters.minExperienceTime, filters.maxExperienceTime]);

    const handleSalaryChange = useCallback((value) => {
        setSalaryRange(value);
        const [min, max] = value;
        if (currency === 'VND') {
            onFilterChange('salaryStart', min > 0 ? min * 1000000 : '');
            onFilterChange('salaryEnd', max < 100 ? max * 1000000 : '');
        } else {
            onFilterChange('salaryStart', min > 0 ? min : '');
            onFilterChange('salaryEnd', max < 50000 ? max : '');
        }
    }, [onFilterChange, currency]);

    const handleCurrencyChange = (clickedCurrency) => {
        const newCurrency = currency === clickedCurrency ? '' : clickedCurrency;
        onFilterChange('currency', newCurrency);
        onFilterChange('salaryStart', '');
        onFilterChange('salaryEnd', '');
    };

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
                <Input
                    allowClear
                    value={filters.location || ''}
                    onChange={(e) => onFilterChange('location', e.target.value)}
                    placeholder="Enter Location"
                    className="w-full"
                    disabled={isLoading}
                />
            </div>

            {/* Job Level */}
            <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Job Level</label>
                <Select
                    fullWidth="true"
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
                    fullWidth="true"
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
                    fullWidth="true"
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
                <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                        Salary Range
                        <span className="ml-2 text-xs font-normal text-slate-500">
                            {currency === 'VND'
                                ? `${salaryRange[0] === 0 ? '0' : `${salaryRange[0]}M`} - ${salaryRange[1] === 100 ? '100M+' : `${salaryRange[1]}M`}`
                                : `${salaryRange[0] === 0 ? '0' : `$${salaryRange[0]}`} - ${salaryRange[1] === 50000 ? '$50000+' : `$${salaryRange[1]}`}`}
                        </span>
                    </label>
                    <div className="flex bg-white border border-slate-300 rounded-md overflow-hidden">
                        <button
                            className={`px-3 py-1 text-xs font-semibold focus:outline-none transition-colors duration-200 ${currency === 'VND'
                                    ? 'bg-orange-500 text-white border-orange-500'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            onClick={() => handleCurrencyChange('VND')}
                        >
                            VND
                        </button>
                        <div className="w-px bg-slate-300"></div>
                        <button
                            className={`px-3 py-1 text-xs font-semibold focus:outline-none transition-colors duration-200 ${currency === 'USD'
                                    ? 'bg-orange-500 text-white border-orange-500'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            onClick={() => handleCurrencyChange('USD')}
                        >
                            USD
                        </button>
                    </div>
                </div>
                <Slider
                    range
                    min={0}
                    max={currency === 'VND' ? 100 : 50000}
                    step={currency === 'VND' ? 5 : 500}
                    value={salaryRange}
                    onChange={setSalaryRange}
                    onChangeComplete={handleSalaryChange}
                    tooltip={{ formatter: (v) => currency === 'VND' ? `${v}M` : `$${v}` }}
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
                    fullWidth="true"
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
                    fullWidth="true"
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
