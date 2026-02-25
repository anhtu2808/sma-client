import React, { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { useParams } from 'react-router-dom';
import { useGetJobByIdQuery, useGetMarkedJobsQuery, useToggleMarkJobMutation } from '@/apis/jobApi';

const Header = () => {
    const { id } = useParams();
    const jobId = Number(id);
    const hasAccessToken = Boolean(localStorage.getItem('accessToken'));
    const [bookmarkLoading, setBookmarkLoading] = useState(false);
    const [optimisticMarked, setOptimisticMarked] = useState(null);
    const { data: jobData } = useGetJobByIdQuery(id);
    const { data: markedJobData } = useGetMarkedJobsQuery(
        { page: 0, size: 1000 },
        { skip: !hasAccessToken }
    );
    const [toggleMarkJob] = useToggleMarkJobMutation();
    const job = jobData?.data;
    const markedJobIds = useMemo(() => {
        const markedJobs = markedJobData?.content || [];
        return new Set(markedJobs.map((markedJob) => Number(markedJob.id)));
    }, [markedJobData]);
    const isMarked = optimisticMarked ?? markedJobIds.has(jobId);

    useEffect(() => {
        setOptimisticMarked(null);
    }, [jobId]);

    if (!job) return null;

    const handleToggleMark = async () => {
        if (!hasAccessToken) {
            message.warning('Please log in to mark jobs.');
            return;
        }
        if (bookmarkLoading) return;

        const previousMarked = isMarked;
        const nextMarked = !previousMarked;
        setOptimisticMarked(nextMarked);
        setBookmarkLoading(true);

        try {
            await toggleMarkJob(jobId).unwrap();
            message.success(nextMarked ? 'Save job successfully' : 'Unsave job successfully');
        } catch (error) {
            setOptimisticMarked(previousMarked);
            message.error(error?.data?.message || 'Failed to save job');
        } finally {
            setBookmarkLoading(false);
        }
    };

    return (
        <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-gray-900 text-2xl md:text-3xl font-bold leading-tight">{job.name}</h1>
            <button
                className={`hidden sm:flex size-10 items-center justify-center rounded-full border transition-colors shrink-0 disabled:opacity-60 ${
                    isMarked
                        ? 'border-primary text-primary'
                        : 'border-gray-200 text-gray-400 hover:text-primary hover:border-primary'
                }`}
                onClick={handleToggleMark}
                disabled={bookmarkLoading}
                type="button"
            >
                <span className="material-icons-round">{isMarked ? 'bookmark' : 'bookmark_border'}</span>
            </button>
        </div>
    );
};

export default Header;
