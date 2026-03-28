import React, { useCallback, useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import ViewerLoading from "../components/ViewerLoading";

const DocxViewer = ({ fileUrl, fileName }) => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDocx = useCallback(async () => {
    if (!fileUrl || !containerRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch document (${response.status})`);
      }
      const arrayBuffer = await response.arrayBuffer();

      // Clear previous content
      containerRef.current.innerHTML = "";

      await renderAsync(arrayBuffer, containerRef.current, null, {
        className: "docx-preview-content",
        inWrapper: true,
        ignoreWidth: false,
        ignoreHeight: true,
        ignoreFonts: false,
        breakPages: true,
        useBase64URL: true,
      });

      setLoading(false);
    } catch (err) {
      console.error("DOCX render error:", err);
      setError(err.message || "Failed to render document");
      setLoading(false);
    }
  }, [fileUrl]);

  useEffect(() => {
    loadDocx();
  }, [loadDocx]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center gap-3">
        <span className="material-icons-round text-4xl text-gray-300 dark:text-neutral-600">
          description
        </span>
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          Unable to preview this DOCX file
        </p>
        <p className="text-xs text-gray-400 dark:text-neutral-500">{error}</p>
        {fileUrl && (
          <a
            href={fileUrl}
            download={fileName || "document.docx"}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <span className="material-icons-round text-base">download</span>
            Download instead
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {loading && <ViewerLoading />}
      <div
        ref={containerRef}
        className={`flex-1 overflow-auto bg-neutral-100 dark:bg-neutral-950 ${
          loading ? "hidden" : ""
        }`}
        style={{ minHeight: 0 }}
      />
      <style>{`
        .docx-preview-content {
          padding: 20px;
        }
        .docx-preview-content .docx-wrapper {
          background: white;
          max-width: 900px;
          margin: 0 auto;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }
        .docx-preview-content .docx-wrapper > section.docx {
          padding: 40px 60px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default DocxViewer;
