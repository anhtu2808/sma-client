import React, { useState, useMemo } from 'react';
import { useGetJobsQuery } from '@/apis/jobApi';

// Import các components con
import JobHero from './sections/JobHero';
import JobFilterSidebar from './sections/JobFilterSidebar';
import JobList from './sections/JobList';

const Jobs = () => {
    const [filters, setFilters] = useState({
        name: '',
        location: '',
        jobLevel: '',
        salaryStart: '',
        skillId: []
    });

    // API Call
    const { data: jobData, isLoading, isError } = useGetJobsQuery({
        page: 0,
        size: 10,
        name: filters.name,
        location: filters.location,
        jobLevel: filters.jobLevel, // Updated param key
        salary: filters.salaryStart,
        skillId: filters.skillId
    });

    // Handlers
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleResetFilters = () => {
        setFilters({ name: '', location: '', jobLevel: '', salaryStart: '', skillId: [] });
    };

    // Data Transformation (Mapping API response to UI props)
    const formattedJobs = useMemo(() => {
        if (!jobData?.content) return [];
        return jobData.content.map(job => ({
            id: job.id,
            title: job.name,
            company: job.companyName || "Unknown Company",
            companyLogo: job.companyLogo,
            location: job.location || "Remote",
            salary: job.salaryMin && job.salaryMax ? `$${job.salaryMin} - $${job.salaryMax}` : "Negotiable",
            tags: job.skills ? job.skills.map(s => s.name) : [],
            postedTime: new Date(job.createdDate).toLocaleDateString(),
            isHot: job.isHot,
            variant: 'primary'
        }));
    }, [jobData]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#1a100c] pt-20">
            {/* 1. Hero Search Section */}
            <JobHero
                searchValue={filters.name}
                onSearchChange={(val) => handleFilterChange('name', val)}
            />

            <div className="container mx-auto px-4 md:px-6 pb-12">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* 2. Sidebar Filter Section */}
                    <JobFilterSidebar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onReset={handleResetFilters}
                    />

                    {/* 3. Main Job List Section */}
                    <main className="flex-1">
                        <JobList
                            jobs={formattedJobs}
                            isLoading={isLoading}
                            isError={isError}
                            onBookmark={(id) => console.log('Bookmark', id)}
                        />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Jobs;