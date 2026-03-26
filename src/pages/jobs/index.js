import React, { useMemo, useState } from 'react';
import { Button as AntButton } from 'antd';
import toastMessage from "@/utils/toastMessage";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetJobsQuery, useGetMarkedJobsQuery, useToggleMarkJobMutation } from '@/apis/jobApi';

// Import các components con
import SearchHero from '@/components/SearchHero';
import Sidebar from './sidebar';
import JobList from './list';

const ITEMS_PER_PAGE = 10;

const Jobs = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        name: searchParams.get('name') || '',
        location: searchParams.get('location') || '',
        jobLevel: '',
        salaryStart: '',
        salaryEnd: '',
        minExperienceTime: '',
        maxExperienceTime: '',
        workingModel: '',
        skillId: [],
        expertiseId: [],
        domainId: []
    });
    const [bookmarkOverrides, setBookmarkOverrides] = useState({});
    const [bookmarkLoadingById, setBookmarkLoadingById] = useState({});
    const hasAccessToken = Boolean(localStorage.getItem('accessToken'));

    // API Call
    // Filter out empty params
    const queryParams = useMemo(() => ({
        page: currentPage - 1,
        size: ITEMS_PER_PAGE,
        ...(filters.name && { name: filters.name }),
        ...(filters.location && { location: filters.location }),
        ...(filters.jobLevel && { jobLevel: filters.jobLevel }),
        ...(filters.salaryStart && { salaryStart: filters.salaryStart }),
        ...(filters.salaryEnd && { salaryEnd: filters.salaryEnd }),
        ...(filters.minExperienceTime && { minExperienceTime: filters.minExperienceTime }),
        ...(filters.maxExperienceTime && { maxExperienceTime: filters.maxExperienceTime }),
        ...(filters.workingModel && { workingModel: filters.workingModel }),
        ...(filters.skillId?.length && { skillId: filters.skillId }),
        ...(filters.expertiseId?.length && { expertiseId: filters.expertiseId }),
        ...(filters.domainId?.length && { domainId: filters.domainId }),
    }), [filters, currentPage]);

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
    // Pagination data
    const totalPages = jobData?.data?.totalPages || jobData?.totalPages || 0; // fallback, will be overwritten by local pagination
    const totalElements = jobData?.data?.totalElements || jobData?.totalElements || 0;

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
        setCurrentPage(1); // Reset to page 1 on filter change
    };

    const handleResetFilters = () => {
        setFilters({
            name: '',
            location: '',
            jobLevel: '',
            salaryStart: '',
            salaryEnd: '',
            minExperienceTime: '',
            maxExperienceTime: '',
            workingModel: '',
            skillId: [],
            expertiseId: [],
            domainId: []
        });
        setCurrentPage(1);
    };

    const handleBookmark = async (jobId) => {
        if (!hasAccessToken) {
            toastMessage.warning('Please log in to mark jobs.');
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
                toastMessage.success(
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
                );
            } else {
                toastMessage.success('Job removed from Saved jobs.');
            }
        } catch (error) {
            setBookmarkOverrides((prev) => ({ ...prev, [jobId]: currentMarked }));
            toastMessage.error(error?.data?.message || 'Failed to update marked job.');
        } finally {
            setBookmarkLoadingById((prev) => ({ ...prev, [jobId]: false }));
        }
    };

    // Data Transformation (Mapping API response to UI props)
    const formattedData = useMemo(() => {
        let dataToMap = jobData?.data?.content || jobData?.content || [];

        const totalItems = jobData?.data?.totalElements || jobData?.totalElements || 0;
        const totalPagesCount = jobData?.data?.totalPages || jobData?.totalPages || 1;

        const mappedJobs = dataToMap.map(job => {
            const normalizedJobId = Number(job.id);
            const isBookmarked = bookmarkOverrides[normalizedJobId] ?? markedJobIds.has(normalizedJobId);
            const salary = (job.salaryStart && job.salaryEnd
                    ? `${new Intl.NumberFormat('vi-VN').format(job.salaryStart)} - ${new Intl.NumberFormat('vi-VN').format(job.salaryEnd)} VND`
                    : "Negotiable");

            // Format location from locations array
            const locationCity = job.locations?.length > 0
                ? job.locations.map(l => l.city || l.name).filter(Boolean).join(', ')
                : job.company?.country || '';

            // Format experience
            const experienceTime = job.experienceTime
                ? (job.experienceTime >= 1 ? `${job.experienceTime} year${job.experienceTime > 1 ? 's' : ''}` : 'Less than 1 year')
                : null;

            // Format job level for display
            const jobLevelMap = {
                'INTERN': 'Intern',
                'FRESHER': 'Fresher',
                'JUNIOR': 'Junior',
                'MIDDLE': 'Middle',
                'SENIOR': 'Senior',
                'LEADER': 'Leader',
                'MANAGER': 'Manager',
            };

            // Format working model for display
            const workingModelMap = {
                'REMOTE': 'Remote',
                'ONSITE': 'Onsite',
                'HYBRID': 'Hybrid',
            };

            return {
                id: normalizedJobId,
                title: job.name,
                company: job.company?.name || "Unknown Company",
                companyLogo: job.company?.logo,
                locationCity,
                workingModel: workingModelMap[job.workingModel] || job.workingModel || '',
                jobLevel: jobLevelMap[job.jobLevel] || job.jobLevel || '',
                experienceTime,
                expertise: job.expertise?.name || '',
                salary,
                tags: job.skills ? [...job.skills].map(s => s.name).sort((a, b) => a.localeCompare(b)) : [],
                postedTime: job.uploadTime ? new Date(job.uploadTime).toLocaleDateString() : "Recently",
                expDate: job.expDate ? new Date(job.expDate).toLocaleDateString() : null,
                isHot: job.isHighlight === true,
                isApplied: job.isApplied,
                isBookmarked,
                isBookmarkLoading: Boolean(bookmarkLoadingById[normalizedJobId]),
            };
        });

        return {
            jobs: mappedJobs,
            totalElements: totalItems,
            totalPages: totalPagesCount
        };
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
                        isLoading={isLoading}
                    />

                    {/* 3. Main Job List Section */}
                    <main className="flex-1">
                        <JobList
                            jobs={formattedData.jobs}
                            isLoading={isLoading}
                            isError={isError}
                            onBookmark={handleBookmark}
                            currentPage={currentPage > formattedData.totalPages ? 1 : currentPage}
                            totalPages={formattedData.totalPages}
                            totalElements={formattedData.totalElements}
                            onPageChange={setCurrentPage}
                        />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Jobs;
