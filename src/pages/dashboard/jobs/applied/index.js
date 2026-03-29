import React from "react";
import DashboardJobCard from "../job-card";
import Loading from "@/components/Loading";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faClockRotateLeft } from '../../../../utils/icons';

const AppliedJobs = ({ jobs, isLoading, isError }) => {
  if (isLoading) {
    return (
      <Loading className="h-[50vh]" />
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16 rounded-2xl bg-white border border-gray-100">
        <FontAwesomeIcon icon={faCircleExclamation} className="text-5xl text-red-300" />
        <h3 className="mt-3 text-xl font-bold text-gray-800">Failed to load applied jobs</h3>
        <p className="text-gray-500 mt-1">Please try again in a moment.</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-16 rounded-2xl bg-white border border-gray-100">
        <FontAwesomeIcon icon={faClockRotateLeft} className="text-5xl text-gray-300" />
        <h3 className="mt-3 text-xl font-bold text-gray-800">No jobs in this tab yet</h3>
        <p className="text-gray-500 mt-1">Try applying or saving jobs to track them from your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {jobs.map((job) => (
        <DashboardJobCard activeTab="applied" job={job} key={job.id} />
      ))}
    </div>
  );
};

export default AppliedJobs;
