import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Button as AntButton } from 'antd';
import { useGetJobsQuery, useGetMarkedJobsQuery, useToggleMarkJobMutation } from '@/apis/jobApi';
import JobCard from '@/components/JobCard';
import Pagination from '@/components/Pagination';
import DataList from '@/components/DataList';

const ITEMS_PER_PAGE = 10;

const CompanyJobs = ({ companyId }) => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [bookmarkOverrides, setBookmarkOverrides] = useState({});
    const [bookmarkLoadingById, setBookmarkLoadingById] = useState({});
    const hasAccessToken = Boolean(localStorage.getItem('accessToken'));

    const queryParams = useMemo(() => ({
        companyId: companyId,
        page: currentPage - 1,
        size: ITEMS_PER_PAGE,
    }), [companyId, currentPage]);

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

    const formattedData = useMemo(() => {
        let dataToMap = jobData?.data?.content || jobData?.content || [];
        const totalItems = jobData?.data?.totalElements || jobData?.totalElements || 0;
        const totalPagesCount = jobData?.data?.totalPages || jobData?.totalPages || 0;

        const mappedJobs = dataToMap.map(job => {
            const normalizedJobId = Number(job.id);
            const isBookmarked = bookmarkOverrides[normalizedJobId] ?? markedJobIds.has(normalizedJobId);
            const salary = job.salaryStart && job.salaryEnd
                ? `${new Intl.NumberFormat('vi-VN').format(job.salaryStart)} - ${new Intl.NumberFormat('vi-VN').format(job.salaryEnd)} ${job.currency || 'VND'}`
                : "Negotiable";

            const locationCity = job.locations?.length > 0
                ? job.locations.map(l => l.city || l.name).filter(Boolean).join(', ')
                : job.company?.country || '';

            const experienceTime = job.experienceTime
                ? (job.experienceTime >= 1 ? `${job.experienceTime} year${job.experienceTime > 1 ? 's' : ''}` : 'Less than 1 year')
                : null;

            const jobLevelMap = {
                'INTERN': 'Intern',
                'FRESHER': 'Fresher',
                'JUNIOR': 'Junior',
                'MIDDLE': 'Middle',
                'SENIOR': 'Senior',
                'LEADER': 'Leader',
                'MANAGER': 'Manager',
            };

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
                isHot: job.jobLevel === "SENIOR" || job.hot,
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
        <div className="bg-white dark:bg-[#2c1a14] rounded-2xl p-6 md:p-8 border border-slate-100 dark:border-[#3d241b]">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100 dark:border-[#3d241b]">
                <span className="material-icons-round text-primary text-2xl">work</span>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Open Positions</h2>
            </div>

            <DataList
                isLoading={isLoading}
                isError={isError}
                data={formattedData.jobs}
                emptyMessage="No open positions right now"
                emptySubMessage="This company doesn't have any open jobs at the moment. Please check back later."
            >
                <div className="space-y-4">
                    {formattedData.jobs?.map((job) => (
                        <JobCard
                            key={job.id}
                            {...job}
                            onClick={() => navigate(`/jobs/${job.id}`)}
                            onBookmark={() => handleBookmark(job.id)}
                        />
                    ))}
                </div>

                {formattedData.totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={formattedData.totalPages}
                        onPageChange={setCurrentPage}
                        className="mt-8"
                    />
                )}
            </DataList>
        </div>
    );
};

export default CompanyJobs;
