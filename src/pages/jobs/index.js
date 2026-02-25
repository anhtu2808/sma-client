import React, { useMemo, useState } from 'react';
import { message, Button as AntButton } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useGetJobsQuery, useGetMarkedJobsQuery, useToggleMarkJobMutation } from '@/apis/jobApi';

// Import các components con
import SearchHero from '@/components/SearchHero';
import Sidebar from './sidebar';
import JobList from './list';

const Jobs = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        name: '',
        location: '',
        jobLevel: '',
        salaryStart: '',
        skillId: []
    });
    const [bookmarkOverrides, setBookmarkOverrides] = useState({});
    const [bookmarkLoadingById, setBookmarkLoadingById] = useState({});
    const hasAccessToken = Boolean(localStorage.getItem('accessToken'));

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
    const { data: markedJobData } = useGetMarkedJobsQuery(
        { page: 0, size: 1000 },
        { skip: !hasAccessToken }
    );
    const [toggleMarkJob] = useToggleMarkJobMutation();

    const markedJobIds = useMemo(() => {
        const markedJobs = markedJobData?.content || [];
        return new Set(markedJobs.map((job) => Number(job.id)));
    }, [markedJobData]);

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

    const handleBookmark = async (jobId) => {
        if (!hasAccessToken) {
            message.warning('Please log in to mark jobs.');
            return;
        }
        if (bookmarkLoadingById[jobId]) return;

        const currentMarked = bookmarkOverrides[jobId] ?? markedJobIds.has(Number(jobId));
        const nextMarked = !currentMarked;

        setBookmarkOverrides((prev) => ({ ...prev, [jobId]: nextMarked }));
        setBookmarkLoadingById((prev) => ({ ...prev, [jobId]: true }));

        try {
            await toggleMarkJob(jobId).unwrap();
            if (nextMarked) {
                message.success({
                    content: (
                        <div className="flex items-center gap-4">
                            <span>This job has been added to your Saved jobs.</span>
                            <AntButton
                                type="link"
                                size="small"
                                className="!p-0 !h-auto font-bold text-primary hover:text-primary/80"
                                onClick={() => navigate('/dashboard/jobs?tab=saved')}
                            >
                                View now
                            </AntButton>
                        </div>
                    ),
                    duration: 5,
                });
            } else {
                message.success('Job removed from Saved jobs.');
            }
        } catch (error) {
            setBookmarkOverrides((prev) => ({ ...prev, [jobId]: currentMarked }));
            message.error(error?.data?.message || 'Failed to update marked job.');
        } finally {
            setBookmarkLoadingById((prev) => ({ ...prev, [jobId]: false }));
        }
    };

    // Data Transformation (Mapping API response to UI props)
    const formattedJobs = useMemo(() => {
        const dataToMap = jobData?.data?.content || jobData?.content || [];

        return dataToMap.map(job => {
            const normalizedJobId = Number(job.id);
            const isBookmarked = bookmarkOverrides[normalizedJobId] ?? markedJobIds.has(normalizedJobId);
            const salary = job.salaryStart && job.salaryEnd
                ? `${new Intl.NumberFormat('vi-VN').format(job.salaryStart)} - ${new Intl.NumberFormat('vi-VN').format(job.salaryEnd)} ${job.currency || 'VND'}`
                : "Negotiable";

            return {
                id: normalizedJobId,
                title: job.name,
                company: job.company?.name || "Unknown Company",
                companyLogo: job.company?.logo,
                location: job.location || job.workingModel || job.company?.country || "Remote",
                salary,
                tags: job.skills ? job.skills.map(s => s.name) : [],
                postedTime: job.uploadTime ? new Date(job.uploadTime).toLocaleDateString() : "Recently",
                isHot: job.jobLevel === "SENIOR" || job.hot, // Map isHot if available, or infer
                isApplied: job.isApplied, // Add isApplied flag
                isBookmarked,
                isBookmarkLoading: Boolean(bookmarkLoadingById[normalizedJobId]),
                variant: 'primary'
            };
        });
    }, [jobData, bookmarkOverrides, bookmarkLoadingById, markedJobIds]);

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
                            onBookmark={handleBookmark}
                        />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Jobs;
