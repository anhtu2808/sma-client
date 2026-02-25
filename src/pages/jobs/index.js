import React, { useState, useMemo, useEffect } from 'react';
import { useGetJobsQuery } from '@/apis/jobApi';

// Import các components con
import SearchHero from '@/components/SearchHero';
import Sidebar from './sidebar';
import JobList from './list';

const Jobs = () => {
    const [filters, setFilters] = useState({
        name: '',
        location: '',
        jobLevel: '',
        salaryStart: '',
        skillId: []
    });

    // API Call
    // Filter out empty params
    const queryParams = useMemo(() => ({
        page: 0,
        size: 10,
        ...(filters.name && { name: filters.name }),
        ...(filters.location && { location: filters.location }),
        ...(filters.jobLevel && { jobLevel: filters.jobLevel }),
        ...(filters.salaryStart && { salary: filters.salaryStart }),
        ...(filters.skillId?.length && { skillId: filters.skillId }),
    }), [filters]);

    // API Call
    const { data: jobData, isLoading, isError } = useGetJobsQuery(queryParams);

    // Debug log
    useEffect(() => {
        console.log("Filters:", filters);
        console.log("Query Params:", queryParams);
        console.log("API Response JobData:", jobData);
    }, [filters, queryParams, jobData]);

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
        const dataToMap = jobData?.data?.content || jobData?.content || [];

        return dataToMap.map(job => {
            const salary = job.salaryStart && job.salaryEnd
                ? `${new Intl.NumberFormat('vi-VN').format(job.salaryStart)} - ${new Intl.NumberFormat('vi-VN').format(job.salaryEnd)} ${job.currency || 'VND'}`
                : "Negotiable";

            return {
                id: job.id,
                title: job.name,
                company: job.company?.name || "Unknown Company",
                companyLogo: job.company?.logo,
                location: job.location || job.workingModel || job.company?.country || "Remote",
                salary,
                tags: job.skills ? job.skills.map(s => s.name) : [],
                postedTime: job.uploadTime ? new Date(job.uploadTime).toLocaleDateString() : "Recently",
                isHot: job.jobLevel === "SENIOR" || job.hot, // Map isHot if available, or infer
                isApplied: job.isApplied, // Add isApplied flag
                variant: 'primary'
            };
        });
    }, [jobData]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#1a100c]">
            {/* 1. Hero Search Section */}
            <SearchHero
                title="Find Your Dream Job"
                subtitle="Browse thousands of job openings from top companies and startups."
                searchValue={filters.name}
                onSearchChange={(val) => handleFilterChange('name', val)}
            />

            <div className="container mx-auto px-4 md:px-6 pb-12">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* 2. Sidebar Filter Section */}
                    <Sidebar
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