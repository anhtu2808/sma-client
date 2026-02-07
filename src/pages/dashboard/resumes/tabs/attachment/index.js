import React, { useMemo, useRef, useState } from "react";
import { message } from "antd";
import Button from "@/components/Button";
import {
  useDeleteCandidateResumeMutation,
  useGetCandidateResumesQuery,
  useUploadCandidateResumeMutation,
  useUploadFilesMutation,
} from "@/apis/resumeApi";
import { RESUME_TYPES } from "@/constant";

const AttachmentsTab = () => {
  const inputRef = useRef(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: resumes = [], isLoading: isLoadingResumes } = useGetCandidateResumesQuery({
    type: RESUME_TYPES.ORIGINAL,
  });
  const [uploadFiles, { isLoading: isUploadingFile }] = useUploadFilesMutation();
  const [uploadCandidateResume, { isLoading: isSavingResume }] = useUploadCandidateResumeMutation();
  const [deleteCandidateResume] = useDeleteCandidateResumeMutation();

  const files = useMemo(
    () =>
      resumes.map((resume) => {
        const timestamp = resume.resumeUrl?.split("/").pop()?.split("_")[0];
        const uploadTime = timestamp && !isNaN(timestamp) 
          ? new Date(parseInt(timestamp)).toLocaleString() 
          : "Unknown";
          
        return {
          id: resume.id,
          name: resume.fileName || resume.resumeName || `Resume #${resume.id}`,
          status: resume.parseStatus || "WAITING",
          type: (resume.fileName || "").toLowerCase().endsWith(".pdf") ? "pdf" : "doc",
          url: resume.resumeUrl,
          uploadTime,
        };
      }),
    [resumes]
  );

  const getErrorMessage = (error, fallbackMessage) =>
    error?.data?.message || error?.message || fallbackMessage;

  const handleUploadFile = async (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("files", selectedFile);

      const uploadResponses = await uploadFiles(formData).unwrap();
      const uploadedFile = Array.isArray(uploadResponses) ? uploadResponses[0] : null;

      if (!uploadedFile?.downloadUrl) {
        throw new Error("Upload file failed");
      }

      await uploadCandidateResume({
        resumeName: selectedFile.name,
        fileName: uploadedFile.originalFileName || selectedFile.name,
        resumeUrl: uploadedFile.downloadUrl,
      }).unwrap();

      message.success("Upload resume successfully");
    } catch (error) {
      message.error(getErrorMessage(error, "Upload resume failed"));
    } finally {
      event.target.value = "";
    }
  };

  const handleDeleteResume = async (resumeId) => {
    try {
      setDeletingId(resumeId);
      await deleteCandidateResume({ resumeId }).unwrap();
      message.success("Delete resume successfully");
    } catch (error) {
      message.error(getErrorMessage(error, "Delete resume failed"));
    } finally {
      setDeletingId(null);
    }
  };

  const isUploading = isUploadingFile || isSavingResume;

  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Attached resume (PDF/DOCX)</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload your latest CV for job applications.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleUploadFile}
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
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF or DOCX up to 10MB</p>
        </button>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Attached Files</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">{files.length} file(s)</span>
        </div>

        {isLoadingResumes ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading resumes...</p>
        ) : files.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No attached resume yet.</p>
        ) : (
        <div className="space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-none">
                  <span className={`material-icons-round ${file.type === "pdf" ? "text-red-500" : "text-blue-500"}`}>
                    {file.type === "pdf" ? "picture_as_pdf" : "description"}
                  </span>
                </div>
                <div className="min-w-0">
                  {file.url ? (
                    <a 
                      href={file.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm font-medium text-gray-900 dark:text-white truncate hover:text-primary hover:underline block cursor-pointer"
                    >
                      {file.name}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">Uploaded: {file.uploadTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-none">
                <Button
                  mode="ghost"
                  size="sm"
                  shape="rounded"
                  btnIcon
                  disabled={!file.url}
                  onClick={() => file.url && window.open(file.url, "_blank", "noopener,noreferrer")}
                >
                 <i className="material-icons-round text-[18px]">download</i>
                </Button>
                <Button
                  mode="ghost"
                  size="sm"
                  shape="rounded"
                  btnIcon
                  disabled={deletingId === file.id}
                  onClick={() => handleDeleteResume(file.id)}
                >
                  <i className="material-icons-round text-[18px]">delete</i>
                </Button>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
};

export default AttachmentsTab;
