import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGetResumeByIdQuery } from "@/apis/resumeApi";
import ViewerToolbar from "./components/ViewerToolbar";
import ViewerLoading from "./components/ViewerLoading";
import ViewerError from "./components/ViewerError";
import PdfCvViewer from "./pdf-viewer";
import DocxViewer from "./docx-viewer";

/**
 * Detect file type from fileName or URL.
 * Returns "pdf", "docx", or "unknown".
 */
const getFileType = (fileName, url) => {
  const name = (fileName || url || "").toLowerCase();
  if (name.match(/\.pdf($|[?#])/)) return "pdf";
  if (name.match(/\.docx?($|[?#])/)) return "docx";
  return "unknown";
};

const CvPreview = () => {
  const { id } = useParams();
  const {
    data: resume,
    isLoading,
    isError,
    error,
  } = useGetResumeByIdQuery(id, { skip: !id });

  const fileType = useMemo(
    () => getFileType(resume?.fileName, resume?.resumeUrl),
    [resume?.fileName, resume?.resumeUrl]
  );

  const fileUrl = resume?.resumeUrl;
  const fileName = resume?.name || resume?.fileName || "Document";

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-neutral-950">
        <ViewerToolbar fileName="Loading..." />
        <ViewerLoading />
      </div>
    );
  }

  // Error state - resume not found or API error
  if (isError || !resume) {
    const errorMessage =
      error?.data?.message || error?.message || "Resume not found or access denied.";
    return (
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-neutral-950">
        <ViewerToolbar fileName="Error" />
        <ViewerError message={errorMessage} />
      </div>
    );
  }

  // No file URL available
  if (!fileUrl) {
    return (
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-neutral-950">
        <ViewerToolbar fileName={fileName} />
        <ViewerError message="No file URL available for this resume." />
      </div>
    );
  }

  // Unknown file type
  if (fileType === "unknown") {
    return (
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-neutral-950">
        <ViewerToolbar fileName={fileName} fileUrl={fileUrl} />
        <ViewerError
          message="This file format is not supported for inline preview."
          fileUrl={fileUrl}
          fileName={fileName}
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-neutral-950">
      <ViewerToolbar fileName={fileName} fileUrl={fileUrl} />
      <div className="flex-1 min-h-0">
        {fileType === "pdf" && <PdfCvViewer fileUrl={fileUrl} />}
        {fileType === "docx" && <DocxViewer fileUrl={fileUrl} fileName={fileName} />}
      </div>
    </div>
  );
};

export default CvPreview;
