import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faRightLeft } from "@/utils/icons";

const UploadPanel = ({ inputRef, isUploading, onUploadFile, exhausted }) => (
  <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
    <input
      ref={inputRef}
      type="file"
      accept=".pdf,.doc,.docx"
      className="hidden"
      onChange={onUploadFile}
    />
    <button
      type="button"
      disabled={isUploading}
      onClick={() => inputRef.current?.click()}
      className="w-full rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 px-6 py-14 text-center hover:border-primary transition-colors disabled:cursor-not-allowed disabled:opacity-70"
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-900/25">
        <FontAwesomeIcon
          icon={exhausted ? faRightLeft : faCloudArrowUp}
          className="text-[28px] text-primary dark:text-orange-400"
        />
      </div>
      <p className="text-sm font-medium text-gray-900 dark:text-white">
        {isUploading ? "Uploading..." : exhausted ? "Upload & replace an existing resume" : "Click to upload or drag and drop"}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {exhausted ? "You've reached the upload limit. Choose a resume to replace." : "PDF, DOC, or DOCX up to 10MB"}
      </p>
    </button>
  </div>
);

export default UploadPanel;
