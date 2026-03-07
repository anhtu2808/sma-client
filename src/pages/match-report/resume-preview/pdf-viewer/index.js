import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import Loading from "@/components/Loading";

const PDF_WORKER_URL = "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

const PdfViewer = ({ resumeUrl, renderError }) => (
  <div className="mx-auto flex h-full w-full flex-col">
    <div className="flex-1 overflow-hidden border border-neutral-200 bg-white shadow-soft">
      <div className="h-full w-full">
        <Worker workerUrl={PDF_WORKER_URL}>
          <Viewer
            fileUrl={resumeUrl}
            renderLoader={() => <Loading size={88} className="h-full py-0" />}
            renderError={renderError}
          />
        </Worker>
      </div>
    </div>
  </div>
);

export default PdfViewer;
