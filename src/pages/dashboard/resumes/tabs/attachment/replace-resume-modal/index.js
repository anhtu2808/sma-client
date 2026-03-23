import React, { useState } from "react";
import { Modal } from "antd";

const ReplaceResumeModal = ({ open, files, loading, onSelect, onCancel }) => {
  const [selectedId, setSelectedId] = useState(null);

  const handleCancel = () => {
    setSelectedId(null);
    onCancel();
  };

  const handleConfirm = () => {
    if (selectedId) onSelect(selectedId);
  };

  return (
    <Modal open={open} onCancel={handleCancel} footer={null} centered destroyOnClose width={620}>
      <div className="-mx-6 -mt-2 border-b border-gray-100 dark:border-gray-700 px-6 pb-4">
        <h3 className="text-[20px] leading-7 font-bold text-gray-900 dark:text-white">Replace a resume</h3>
      </div>

      <div className="pt-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          You've reached the upload limit. Select a resume to replace with your new file.
          The selected resume will be permanently deleted.
        </p>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {files.map((file) => (
            <button
              key={file.id}
              type="button"
              onClick={() => setSelectedId(file.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-colors ${
                selectedId === file.id
                  ? "border-primary bg-orange-50 dark:bg-orange-900/10"
                  : "border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
            >
              <div className="h-9 w-9 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-none">
                <span className={`material-icons-round text-sm ${file.type === "pdf" ? "text-red-500" : "text-blue-500"}`}>
                  {file.type === "pdf" ? "picture_as_pdf" : "description"}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Uploaded: {file.uploadTime}</p>
              </div>
              {selectedId === file.id && (
                <span className="material-icons-round text-primary text-xl">check_circle</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="-mx-6 mt-8 border-t border-gray-100 dark:border-gray-700 px-6 pt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="px-5 h-10 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={loading || !selectedId}
          className="px-5 h-10 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? "Replacing..." : "Replace & continue"}
        </button>
      </div>
    </Modal>
  );
};

export default ReplaceResumeModal;
