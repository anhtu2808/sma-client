import React from "react";

const UploadPanel = ({ inputRef, isUploading, onUploadFile }) => (
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
      <div className="bg-blue-50 dark:bg-blue-900/20 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="material-icons-round text-[28px] text-blue-500 dark:text-blue-400">cloud_upload</span>
      </div>
      <p className="text-sm font-medium text-gray-900 dark:text-white">
        {isUploading ? "Uploading..." : "Click to upload or drag and drop"}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF, DOC, or DOCX up to 10MB</p>
    </button>
  </div>
);

export default UploadPanel;
