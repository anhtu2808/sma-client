import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faDownload } from '../../../utils/icons';

const ViewerError = ({ message, fileUrl, fileName }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full py-20 px-6 text-center gap-4">
      <FontAwesomeIcon icon={faCircleExclamation} className="text-5xl text-gray-300 dark:text-neutral-600" />
      <div>
        <p className="text-base font-medium text-gray-700 dark:text-neutral-300">
          Unable to load document
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
          {message || "The document could not be previewed."}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {fileUrl && (
          <a
            href={fileUrl}
            download={fileName || "resume"}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            <FontAwesomeIcon icon={faDownload} className="text-[16px]" />
            Download instead
          </a>
        )}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
        >
          Go back
        </button>
      </div>
    </div>
  );
};

export default ViewerError;
