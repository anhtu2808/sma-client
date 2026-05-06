import React, { useCallback, useEffect, useRef, useState } from "react";
import * as mammoth from "mammoth/mammoth.browser";
import ViewerLoading from "../components/ViewerLoading";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileLines } from '../../../utils/icons';

const DocxViewer = ({ fileUrl, fileName }) => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [html, setHtml] = useState("");

  const loadDocx = useCallback(async () => {
    if (!fileUrl) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch document (${response.status})`);
      }
      const arrayBuffer = await response.arrayBuffer();

      const result = await mammoth.convertToHtml(
        { arrayBuffer },
        {
          styleMap: [
            "p[style-name='Title'] => h1.cv-title",
            "p[style-name='Subtitle'] => h2.cv-subtitle",
            "p[style-name='Heading 1'] => h2.cv-heading",
            "p[style-name='Heading 2'] => h3.cv-heading",
            "p[style-name='Heading 3'] => h4.cv-heading",
          ],
          ignoreEmptyParagraphs: true,
        }
      );

      setHtml(result.value || "<p>(empty document)</p>");
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
        <FontAwesomeIcon icon={faFileLines} className="text-4xl text-gray-300 dark:text-neutral-600" />
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
            <FontAwesomeIcon icon={faDownload} className="text-base" />
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
        className={`flex-1 overflow-auto bg-neutral-100 dark:bg-neutral-950 ${loading ? "hidden" : ""}`}
        style={{ minHeight: 0 }}
      >
        <div className="docx-mammoth-page">
          <div
            ref={containerRef}
            className="docx-mammoth-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
      <style>{`
        .docx-mammoth-page {
          max-width: 880px;
          margin: 24px auto;
          background: #ffffff;
          padding: 56px 64px;
          box-shadow: 0 2px 14px rgba(0, 0, 0, 0.08);
          border-radius: 6px;
          color: #1f2937;
          line-height: 1.6;
          font-size: 14.5px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .docx-mammoth-content h1,
        .docx-mammoth-content h2,
        .docx-mammoth-content h3,
        .docx-mammoth-content h4 {
          color: #111827;
          font-weight: 700;
          margin: 1.2em 0 0.5em;
          line-height: 1.3;
        }
        .docx-mammoth-content h1 { font-size: 1.8rem; }
        .docx-mammoth-content h2 { font-size: 1.35rem; color: #1e3a8a; }
        .docx-mammoth-content h3 { font-size: 1.15rem; }
        .docx-mammoth-content h4 { font-size: 1rem; }
        .docx-mammoth-content p {
          margin: 0.5em 0;
          word-break: break-word;
        }
        .docx-mammoth-content ul,
        .docx-mammoth-content ol {
          margin: 0.5em 0 0.8em 1.5em;
          padding-left: 1em;
        }
        .docx-mammoth-content li {
          margin: 0.25em 0;
        }
        .docx-mammoth-content a {
          color: #2563eb;
          text-decoration: underline;
          word-break: break-all;
        }
        .docx-mammoth-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
          table-layout: auto;
        }
        .docx-mammoth-content th,
        .docx-mammoth-content td {
          border: 1px solid #e5e7eb;
          padding: 8px 12px;
          text-align: left;
          word-break: break-word;
          vertical-align: top;
        }
        .docx-mammoth-content th {
          background: #f9fafb;
          font-weight: 600;
        }
        .docx-mammoth-content img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
        }
        .docx-mammoth-content strong { font-weight: 700; }
        .docx-mammoth-content em { font-style: italic; }
        @media (max-width: 768px) {
          .docx-mammoth-page {
            margin: 12px;
            padding: 28px 20px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default DocxViewer;
