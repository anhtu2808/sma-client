import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetSimilarJobsQuery } from '@/apis/jobApi';

const SimilarJobsCard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: similarJobs = [], isLoading } = useGetSimilarJobsQuery(id, { skip: !id });

    const jobs = useMemo(() => {
        return similarJobs.slice(0, 5).map(job => {
            const salary = job.salaryStart && job.salaryEnd
                ? `${new Intl.NumberFormat('vi-VN').format(job.salaryStart)} - ${new Intl.NumberFormat('vi-VN').format(job.salaryEnd)} ${job.currency || 'VND'}`
                : 'Negotiable';

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
    }, [similarJobs]);

    // Skeleton loader
    const SkeletonItem = () => (
        <div className="animate-pulse flex items-start gap-3 py-3">
            <div className="w-10 h-10 rounded-lg bg-gray-200 shrink-0"></div>
            <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-gray-200 rounded w-4/5"></div>
                <div className="h-3 bg-gray-200 rounded w-3/5"></div>
                <div className="h-3 bg-gray-200 rounded w-2/5"></div>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-gray-900 font-bold mb-1 flex items-center gap-2">
                Similar Jobs
            </h4>
            <p className="text-xs text-gray-400 mb-4">Jobs you might also be interested in</p>

            {isLoading ? (
                <div className="divide-y divide-gray-50">
                    {[1, 2, 3].map(i => <SkeletonItem key={i} />)}
                </div>
            ) : jobs.length === 0 ? (
                <div className="text-sm text-gray-400 text-center py-8 flex flex-col items-center gap-2">
                    <span className="material-icons-round text-3xl text-gray-200">search_off</span>
                    No similar jobs found
                </div>
            ) : (
                <div className="divide-y divide-gray-50">
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            onClick={() => navigate(`/jobs/${job.id}`)}
                            className="flex items-start gap-3 py-3 cursor-pointer group hover:bg-gray-50/50 -mx-2 px-2 rounded-lg transition-colors"
                        >
                            {/* Logo */}
                            <div className="w-10 h-10 rounded-lg border border-gray-100 bg-white p-1 shrink-0 flex items-center justify-center overflow-hidden">
                                {job.companyLogo ? (
                                    <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
                                ) : (
                                    <span className="text-sm font-bold text-gray-300">
                                        {job.company?.charAt(0) || 'C'}
                                    </span>
                                )}
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start gap-1.5">
                                    <h5 className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                        {job.title}
                                    </h5>
                                    {job.isHot && (
                                        <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-wide mt-0.5">
                                            <span className="material-icons-round" style={{ fontSize: '10px' }}>local_fire_department</span>
                                            HOT
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 truncate mt-0.5">{job.company}</p>
                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                                    <span className="font-semibold text-primary">{job.salary}</span>
                                    {job.locationCity && (
                                        <>
                                            <span>•</span>
                                            <span className="inline-flex items-center gap-0.5 truncate">
                                                <span className="material-icons-round" style={{ fontSize: '12px' }}>location_on</span>
                                                {job.locationCity}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SimilarJobsCard;
