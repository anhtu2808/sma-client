import React from 'react';
import JobCard from '@/components/JobCard';
import DataList from '@/components/DataList';
import { useNavigate } from 'react-router-dom';

const JobList = ({ jobs, isLoading, isError, onBookmark }) => {
    const navigate = useNavigate();

    return (
        <DataList
            isLoading={isLoading}
            isError={isError}
            data={jobs}
            emptyMessage="No jobs found"
            emptySubMessage="Try adjusting your search criteria or filters."
        >
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {jobs?.length} Jobs Found
                </h1>
            </div>
            <div className="space-y-4">
                {jobs?.map((job) => (
                    <JobCard
                        key={job.id}
                        {...job}
                        variant={job.isApplied ? 'secondary' : 'primary'}
                        isApplied={job.isApplied}
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        onApply={() => navigate(`/jobs/${job.id}`)}
                        onBookmark={() => onBookmark && onBookmark(job.id)}
                    />
                ))}
            </div>
        </DataList>
    );
};

export default JobList;