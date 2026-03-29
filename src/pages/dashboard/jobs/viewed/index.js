import React from "react";
import DashboardJobCard from "../job-card";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft } from '../../../../utils/icons';

const ViewedJobs = ({ jobs }) => {
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
        <DashboardJobCard activeTab="viewed" job={job} key={job.id} />
      ))}
    </div>
  );
};

export default ViewedJobs;
