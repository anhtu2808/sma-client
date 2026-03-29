import React from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import { searchPlugin } from "@react-pdf-viewer/search";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import "@react-pdf-viewer/search/lib/styles/index.css";
import ViewerLoading from "../components/ViewerLoading";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFilePdf } from '../../../utils/icons';

const PDF_WORKER_URL =
  "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

const PdfCvViewer = ({ fileUrl, onError }) => {
  const toolbarPluginInstance = toolbarPlugin();
  const searchPluginInstance = searchPlugin();
  const { Toolbar } = toolbarPluginInstance;

  const renderError = () => (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-3">
      <FontAwesomeIcon icon={faFilePdf} className="text-4xl text-gray-300 dark:text-neutral-600" />
      <p className="text-sm text-gray-500 dark:text-neutral-400">
        Unable to load PDF preview
      </p>
      {fileUrl && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <FontAwesomeIcon icon={faDownload} className="text-base" />
          Download PDF
        </a>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* PDF Toolbar: zoom, page nav, search */}
      <div className="border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 px-2 py-1">
        <Toolbar>
          {(props) => {
            const {
              CurrentPageInput,
              GoToNextPage,
              GoToPreviousPage,
              NumberOfPages,
              ShowSearchPopover,
              ZoomIn,
              ZoomOut,
              Zoom,
            } = props;
            return (
              <div className="flex items-center gap-1 flex-wrap">
                {/* Page navigation */}
                <div className="flex items-center gap-0.5">
                  <GoToPreviousPage />
                  <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-neutral-300">
                    <CurrentPageInput /> / <NumberOfPages />
                  </div>
                  <GoToNextPage />
                </div>

                <div className="w-px h-5 bg-gray-300 dark:bg-neutral-600 mx-1" />

                {/* Zoom controls */}
                <div className="flex items-center gap-0.5">
                  <ZoomOut />
                  <Zoom />
                  <ZoomIn />
                </div>

                <div className="w-px h-5 bg-gray-300 dark:bg-neutral-600 mx-1" />

                {/* Search */}
                <ShowSearchPopover />
              </div>
            );
          }}
        </Toolbar>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto bg-neutral-100 dark:bg-neutral-950">
        <Worker workerUrl={PDF_WORKER_URL}>
          <Viewer
            fileUrl={fileUrl}
            plugins={[toolbarPluginInstance, searchPluginInstance]}
            renderLoader={() => <ViewerLoading />}
            renderError={renderError}
          />
        </Worker>
      </div>
    </div>
  );
};

export default PdfCvViewer;
