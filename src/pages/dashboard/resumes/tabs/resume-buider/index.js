import React from "react";
import { useNavigate } from "react-router-dom";

const ResumeBuilderTab = () => {
  const navigate = useNavigate();

  return (
    <section>
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div
          onClick={() => navigate('/dashboard/resumes/templates')}
          className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center p-12 cursor-pointer hover:border-primary hover:bg-orange-50/50 dark:hover:bg-gray-700/50 transition-all group"
        >
          <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-gray-700 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
            <span className="material-icons-round text-[28px] text-primary group-hover:text-white">add</span>
          </div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Create New Resume</h3>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">Choose a professionally designed template to get started building your resume.</p>
        </div>
      </div>
    </section>
  );
};

export default ResumeBuilderTab;
