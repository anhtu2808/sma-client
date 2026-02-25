import React from 'react';
import JobCard from '@/components/JobCard';
import DataList from '@/components/DataList';
import Pagination from '@/components/Pagination';
import { useNavigate } from 'react-router-dom';

const JobList = ({ jobs, isLoading, isError, onBookmark, currentPage, totalPages, totalElements, onPageChange }) => {
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
                    {totalElements || jobs?.length} Jobs Found
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

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    className="mt-8"
                />
            )}
        </DataList>
    );
};

export default JobList;