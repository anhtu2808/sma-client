import React from 'react';
import JobCard from '@/components/JobCard';
import { useNavigate } from 'react-router-dom';

const JobList = ({ jobs, isLoading, isError, onBookmark }) => {
    const navigate = useNavigate();

    // 1. Loading State
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // 2. Error State
    if (isError) {
        return (
            <div className="text-center py-20 bg-white dark:bg-[#2c1a14] rounded-2xl border border-red-100">
                <p className="text-red-500 font-medium">Failed to load jobs. Please try again later.</p>
            </div>
        );
    }

    // 3. Empty State
    if (jobs.length === 0) {
        return (
            <div className="text-center py-20 bg-white dark:bg-[#2c1a14] rounded-2xl border border-slate-100 dark:border-[#3d241b]">
                <span className="material-icons-round text-6xl text-slate-200 dark:text-slate-700 mb-4">search_off</span>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No jobs found</h3>
                <p className="text-slate-500 dark:text-slate-400">Try adjusting your search criteria or filters.</p>
            </div>
        );
    }

    // 4. Data List
    return (
        <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {jobs.length} Jobs Found
                </h1>
            </div>
            <div className="space-y-4">
                {jobs.map((job) => (
                    <JobCard
                        key={job.id}
                        {...job}
                        onApply={() => navigate(`/jobs/${job.id}`)}
                        onBookmark={() => onBookmark && onBookmark(job.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default JobList;