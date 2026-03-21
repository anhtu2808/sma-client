import Button from '@/components/Button';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetJobsQuery } from '@/apis/jobApi';
import { VIETNAM_PROVINCES } from '@/constant/job';
import FeaturedJobsSection from './FeaturedJobsSection';

const popularKeywords = [
    'Frontend', 'Backend', 'React', 'Java', 'Python', 'DevOps',
    'Full Stack', 'Mobile', 'Data Engineer', 'QA Tester', 'UI/UX', 'Project Manager',
];

function useDebounce(value, delay) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

const HeroSection = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [locationFilter, setLocationFilter] = useState('');

    const searchBoxRef = useRef(null);
    const keywordInputRef = useRef(null);
    const locationInputRef = useRef(null);

    const debouncedKeyword = useDebounce(keyword, 300);

    const { data: jobData } = useGetJobsQuery(
        { name: debouncedKeyword, size: 5 },
        { skip: debouncedKeyword.length < 2 }
    );

    const suggestions = useMemo(() => {
        if (debouncedKeyword.length < 2) return [];
        const rawJobs = jobData?.data?.content || jobData?.content || [];
        return rawJobs.map(job => ({
            id: Number(job.id),
            title: job.name,
            company: job.company?.name || 'Unknown Company',
            companyLogo: job.company?.logo,
            salary: job.salaryStart && job.salaryEnd
                ? `${new Intl.NumberFormat('vi-VN').format(job.salaryStart)} - ${new Intl.NumberFormat('vi-VN').format(job.salaryEnd)} VND`
                : 'Negotiable',
        }));
    }, [jobData, debouncedKeyword]);

    const filteredProvinces = useMemo(() => {
        if (!locationFilter.trim()) return VIETNAM_PROVINCES;
        const lower = locationFilter.toLowerCase();
        return VIETNAM_PROVINCES.filter(p => p.toLowerCase().includes(lower));
    }, [locationFilter]);


    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
                setIsFocused(false);
                setShowLocationDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = () => {
        setIsFocused(false);
        setShowLocationDropdown(false);
        const params = new URLSearchParams();
        if (keyword.trim()) params.set('name', keyword.trim());
        if (location.trim()) params.set('location', location.trim());
        navigate(`/jobs?${params.toString()}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleSuggestionClick = (job) => {
        setIsFocused(false);
        navigate(`/jobs/${job.id}`);
    };

    const handleSelectProvince = (province) => {
        setLocation(province);
        setShowLocationDropdown(false);
        setLocationFilter('');
    };

    const handleKeywordFocus = () => {
        setIsFocused(true);
        setShowLocationDropdown(false);
    };

    const handleLocationClick = () => {
        setShowLocationDropdown(prev => !prev);
        setIsFocused(false);
        setTimeout(() => locationInputRef.current?.focus(), 0);
    };

    return (
        <section className="relative pt-24 pb-16 overflow-hidden bg-gradient-to-b from-orange-50/60 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">

            {/* Decorative glow orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-300/20 dark:bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-20 -left-40 w-[400px] h-[400px] bg-amber-200/20 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-20 -right-40 w-[400px] h-[400px] bg-orange-200/15 dark:bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Dot pattern overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">

                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-100/80 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm font-medium mb-6">
                    <span className="material-icons-round text-base">auto_awesome</span>
                    AI-Powered Job Matching
                </div>

                {/* Heading */}
                <h1 className="text-4xl md:text-6xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1] text-gray-900 dark:text-white max-w-4xl mx-auto">
                    Connecting top-tier tech talent <br className="hidden md:block" /> with <br className="hidden md:block" /> <span className="text-gradient bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">innovative companies</span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                    SmartRecruit is the ultimate bridge between elite developers and world-class organizations. Streamline your hiring process today.
                </p>

                {/* Search Box */}
                <div ref={searchBoxRef} className="relative max-w-3xl mx-auto mb-4 z-20">
                    {/* Glow behind search bar */}
                    <div className="absolute -inset-3 bg-gradient-to-r from-orange-200/40 via-amber-200/30 to-orange-200/40 dark:from-orange-500/10 dark:via-amber-500/5 dark:to-orange-500/10 rounded-3xl blur-xl pointer-events-none" />
                    <div className="relative bg-white dark:bg-surface-dark p-3 sm:p-2 rounded-2xl sm:rounded-full shadow-xl shadow-gray-200/50 dark:shadow-orange-500/5 ring-1 ring-gray-100 dark:ring-orange-500/10 flex flex-col sm:flex-row gap-3 sm:gap-2">
                        {/* Keyword Input */}
                        <div className="flex-1 h-12 flex items-center px-4 border-b sm:border-b-0 sm:border-r border-gray-100 dark:border-gray-700">
                            <span className="material-icons-round text-gray-400 mr-2">search</span>
                            <input
                                ref={keywordInputRef}
                                className="w-full bg-transparent border-none focus:ring-0 text-gray-800 dark:text-white placeholder-gray-400 text-sm outline-none"
                                placeholder="Job title, keywords..."
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={handleKeywordFocus}
                            />
                            {keyword && (
                                <button type="button" onClick={() => setKeyword('')} className="text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 transition p-0.5">
                                    <span className="material-icons-round text-base">close</span>
                                </button>
                            )}
                        </div>

                        {/* Location Dropdown Trigger */}
                        <div
                            className="relative h-12 flex items-center px-4 cursor-pointer shrink-0 w-full sm:w-48"
                            onClick={handleLocationClick}
                        >
                            <span className="material-icons-round text-gray-400 mr-2">location_on</span>
                            <span className={`flex-1 text-left text-sm truncate ${location ? 'text-gray-800 dark:text-white' : 'text-gray-400'}`}>
                                {location || 'All locations'}
                            </span>
                            {location ? (
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setLocation(''); }}
                                    className="text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 transition p-0.5"
                                >
                                    <span className="material-icons-round text-base">close</span>
                                </button>
                            ) : (
                                <span className="material-icons-round text-gray-400 text-lg">expand_more</span>
                            )}

                            {/* Location Dropdown */}
                            {showLocationDropdown && (
                                <div className="absolute left-0 right-0 top-full mt-3 w-full min-w-[240px] bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden text-left z-50" onClick={(e) => e.stopPropagation()}>
                                    <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                            <span className="material-icons-round text-gray-400 text-sm">search</span>
                                            <input
                                                ref={locationInputRef}
                                                type="text"
                                                className="w-full bg-transparent border-none focus:ring-0 text-gray-800 dark:text-white placeholder-gray-400 text-sm outline-none"
                                                placeholder="Search province..."
                                                value={locationFilter}
                                                onChange={(e) => setLocationFilter(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="max-h-52 overflow-y-auto p-1.5">
                                        <button
                                            type="button"
                                            onClick={() => handleSelectProvince('')}
                                            className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition ${!location
                                                    ? 'bg-primary/10 text-primary font-medium'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            All locations
                                        </button>
                                        {filteredProvinces.map((province) => (
                                            <button
                                                key={province}
                                                type="button"
                                                onClick={() => handleSelectProvince(province)}
                                                className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition ${location === province
                                                        ? 'bg-primary/10 text-primary font-medium'
                                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                    }`}
                                            >
                                                {province}
                                            </button>
                                        ))}
                                        {filteredProvinces.length === 0 && (
                                            <p className="text-sm text-gray-400 py-3 text-center">No provinces found</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Button
                            mode="primary"
                            size="md"
                            className="h-12 px-8 shrink-0 w-full sm:w-auto rounded-xl sm:rounded-full"
                            glow={true}
                            onClick={handleSearch}
                        >
                            Find a Job
                        </Button>
                    </div>

                    {/* Keyword Autocomplete Dropdown */}
                    {isFocused && (
                        <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-surface-dark rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden text-left">
                            <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-gray-700">
                                {/* Left: Popular Keywords */}
                                <div className="sm:w-1/2 p-4">
                                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-wide mb-3">Popular Keywords</p>
                                    <div className="flex flex-wrap gap-2">
                                        {popularKeywords.map((kw) => (
                                            <button
                                                key={kw}
                                                type="button"
                                                onClick={() => { setKeyword(kw); keywordInputRef.current?.focus(); }}
                                                className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700 hover:border-primary/40 hover:text-primary hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all"
                                            >
                                                {kw}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Right: Job Suggestions */}
                                <div className="sm:w-1/2 p-4">
                                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-wide mb-3">
                                        {debouncedKeyword.length >= 2 ? 'Suggestions' : 'Type to search jobs'}
                                    </p>
                                    {suggestions.length > 0 ? (
                                        <div className="space-y-1">
                                            {suggestions.map((job) => (
                                                <button
                                                    key={job.id}
                                                    type="button"
                                                    onClick={() => handleSuggestionClick(job)}
                                                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left"
                                                >
                                                    <div className="w-9 h-9 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                                                        {job.companyLogo ? (
                                                            <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
                                                        ) : (
                                                            <span className="text-sm font-bold text-gray-400">{job.company?.charAt(0) || 'C'}</span>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{job.title}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                            {job.company} &middot; <span className="text-primary font-medium">{job.salary}</span>
                                                        </p>
                                                    </div>
                                                    <span className="material-icons-round text-gray-300 dark:text-gray-600 text-sm shrink-0">arrow_forward</span>
                                                </button>
                                            ))}
                                        </div>
                                    ) : debouncedKeyword.length >= 2 ? (
                                        <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">No jobs found</p>
                                    ) : (
                                        <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">Enter at least 2 characters</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="material-icons-round text-orange-500 text-lg">work</span>
                        <span className="font-semibold text-gray-900 dark:text-white">10,000+</span> Active Jobs
                    </div>
                    <div className="hidden sm:block w-px h-5 bg-gray-200 dark:bg-gray-700" />
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="material-icons-round text-orange-500 text-lg">apartment</span>
                        <span className="font-semibold text-gray-900 dark:text-white">5,000+</span> Companies
                    </div>
                    <div className="hidden sm:block w-px h-5 bg-gray-200 dark:bg-gray-700" />
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="material-icons-round text-orange-500 text-lg">groups</span>
                        <span className="font-semibold text-gray-900 dark:text-white">50,000+</span> Candidates
                    </div>
                </div>

                <FeaturedJobsSection />
            </div>
        </section>
    );
};

export default HeroSection;
