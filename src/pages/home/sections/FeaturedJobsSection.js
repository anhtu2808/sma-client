import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetJobsQuery } from '@/apis/jobApi';

const FeaturedJobsSection = () => {
    const navigate = useNavigate();
    const { data: jobData, isLoading } = useGetJobsQuery({ page: 0, size: 9 });

    const featuredJobs = useMemo(() => {
        const rawJobs = jobData?.data?.content || jobData?.content || [];
        return rawJobs.map(job => {
            const salary = job.salaryStart && job.salaryEnd
                ? `${new Intl.NumberFormat('vi-VN').format(job.salaryStart)} - ${new Intl.NumberFormat('vi-VN').format(job.salaryEnd)} ${job.currency || 'VND'}`
                : 'Thoả thuận';

            const locationCity = job.locations?.length > 0
                ? job.locations.map(l => l.city || l.name).filter(Boolean).join(', ')
                : job.company?.country || '';

            return {
                id: Number(job.id),
                title: job.name,
                company: job.company?.name || 'Unknown Company',
                companyLogo: job.company?.logo,
                salary,
                locationCity,
                isHot: job.isHighlight === true,
            };
        });
    }, [jobData]);

    // Skeleton card for loading state
    const SkeletonCard = () => (
        <div className="animate-pulse bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/5"></div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </div>
        </div>
    );

    return (
        <section className="py-16 bg-white dark:bg-background-dark">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                    <button
                        onClick={() => navigate('/jobs')}
                        className="mt-4 md:mt-0 text-primary font-semibold hover:underline inline-flex items-center gap-1 text-sm"
                    >
                        View All Jobs <span className="material-icons-round text-sm">arrow_forward</span>
                    </button>
                </div>

                {/* Job Cards Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {featuredJobs.map((job) => (
                            <div
                                key={job.id}
                                onClick={() => navigate(`/jobs/${job.id}`)}
                                className="group bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300 cursor-pointer relative"
                            >
                                {/* HOT badge */}
                                {job.isHot && (
                                    <span className="absolute top-3 right-3 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wide border border-primary/20">
                                        <span className="material-icons-round text-xs">local_fire_department</span>
                                        HOT
                                    </span>
                                )}

                                {/* Company logo + Job info */}
                                <div className="flex items-start gap-3.5 mb-4">
                                    {/* Logo */}
                                    <div className="w-12 h-12 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 p-1.5 shrink-0 flex items-center justify-center overflow-hidden">
                                        {job.companyLogo ? (
                                            <img
                                                src={job.companyLogo}
                                                alt={job.company}
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <span className="text-lg font-bold text-gray-400 dark:text-gray-600">
                                                {job.company?.charAt(0) || 'C'}
                                            </span>
                                        )}
                                    </div>

                                    {/* Title + Company */}
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-0.5">
                                            {job.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {job.company}
                                        </p>
                                    </div>
                                </div>

                                {/* Footer: Salary + Location + Bookmark */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800">
                                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 min-w-0">
                                        <span className="font-semibold text-primary whitespace-nowrap">{job.salary}</span>
                                        {job.locationCity && (
                                            <span className="inline-flex items-center gap-0.5 truncate">
                                                <span className="material-icons-round text-xs">location_on</span>
                                                {job.locationCity}
                                            </span>
                                        )}
                                    </div>
                                    <span className="material-icons-round text-gray-300 dark:text-gray-600 text-lg shrink-0 group-hover:text-primary/40 transition-colors">
                                        favorite_border
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedJobsSection;
