import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowUpRightFromSquare, faDownload } from '../../../utils/icons';

const ViewerToolbar = ({ fileName, fileUrl }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/dashboard/resumes");
    }
  };

  const handleDownload = () => {
    if (!fileUrl) return;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName || "resume";
    link.click();
  };

  const handleOpenNewTab = () => {
    if (!fileUrl) return;
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700 shadow-sm">
      <button
        onClick={handleBack}
        className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="text-[20px]" />
        <span className="hidden sm:inline">Back</span>
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {fileName || "Document Preview"}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={handleOpenNewTab}
          disabled={!fileUrl}
          className="p-1.5 rounded-lg text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-40"
          title="Open in new tab"
        >
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[20px]" />
        </button>
        <button
          onClick={handleDownload}
          disabled={!fileUrl}
          className="p-1.5 rounded-lg text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-40"
          title="Download"
        >
          <FontAwesomeIcon icon={faDownload} className="text-[20px]" />
        </button>
      </div>
    </div>
  );
};

export default ViewerToolbar;
