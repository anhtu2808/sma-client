import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Input, Tooltip } from 'antd';
import { FileCheck, Send, Info, Loader2, X, Download } from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import {
  useUploadFilesMutation,
  useExportEnhancementToOriginalMutation,
  useUpdateEnhancementContentMutation,
} from '@/apis/resumeApi';
import toastMessage from '@/utils/toastMessage';
import './resume-editor/resumeEditor.css';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const NAME_MAX_LENGTH = 100;

// A4 dimensions at 96 DPI
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const PREVIEW_SCALE = 0.82;

/**
 * Modal that packages the edited enhancement content into a new ORIGINAL resume (PDF).
 *
 * Preview strategy: render the editor HTML live inside an A4-sized, scaled-down container
 * (CSS zoom) — this gives a crisp, readable preview without any html2canvas rasterization.
 * The actual html2canvas → jsPDF pipeline runs only when user clicks Save.
 */
const ExportEnhancementModal = ({
  open,
  onClose,
  editor,
  enhancementId,
  originalResumeName,
  jobId,
  jobTitle,
  companyName,
}) => {
  const navigate = useNavigate();
  const printRef = useRef(null); // A4-sized container used for both preview & PDF

  const [cvName, setCvName] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStep, setExportStep] = useState(null);

  const [updateContent] = useUpdateEnhancementContentMutation();
  const [uploadFiles] = useUploadFilesMutation();
  const [exportEnhancement] = useExportEnhancementToOriginalMutation();

  const defaultCvName = useMemo(() => {
    const base = originalResumeName || 'Resume';
    const suffix = jobTitle ? ` – Optimized for ${jobTitle}` : ' – Optimized';
    const combined = `${base}${suffix}`;
    return combined.length > NAME_MAX_LENGTH ? combined.slice(0, NAME_MAX_LENGTH) : combined;
  }, [originalResumeName, jobTitle]);

  // Init on open: save latest editor content and load it into preview
  useEffect(() => {
    if (!open) return;
    setCvName(defaultCvName);
    if (!editor || !enhancementId) return;

    setIsInitializing(true);
    const html = editor.getHTML();
    updateContent({ id: enhancementId, content: html })
      .unwrap()
      .then(() => setHtmlContent(html))
      .catch(() => {
        // Even if save fails, still show preview from current editor content
        setHtmlContent(html);
      })
      .finally(() => setIsInitializing(false));
  }, [open, editor, enhancementId, defaultCvName, updateContent]);

  const buildPdfBlob = useCallback(async () => {
    const container = printRef.current;
    if (!container) throw new Error('Preview container not ready');

    // Inline cross-origin images (avatar) so html2canvas can render them
    const imgs = container.querySelectorAll('img');
    const originalSrcs = [];
    for (const img of imgs) {
      if (img.src && !img.src.startsWith('data:')) {
        originalSrcs.push({ img, src: img.src });
        try {
          const response = await fetch(img.src);
          const blob = await response.blob();
          const dataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
          img.src = dataUrl;
        } catch (e) {
          console.warn('Could not inline image:', e);
        }
      }
    }

    await new Promise((r) => setTimeout(r, 60));

    // Let html2canvas auto-detect dimensions from the element itself.
    // Passing explicit width/windowWidth causes content misalignment when combined
    // with position: fixed offscreen positioning.
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      foreignObjectRendering: false,
      onclone: (_clonedDoc, clonedEl) => {
        // Force the clone to be fully visible at (0,0) so html2canvas captures
        // it correctly (the live element is hidden via visibility/z-index).
        clonedEl.style.visibility = 'visible';
        clonedEl.style.zIndex = '0';
        clonedEl.style.position = 'static';
      },
    });

    // Restore original src
    for (const { img, src } of originalSrcs) {
      img.src = src;
    }

    const imgData = canvas.toDataURL('image/jpeg', 0.85);
    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4', compress: true });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgHeightMm = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeightMm;
    let position = 0;
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightMm, undefined, 'FAST');
    heightLeft -= pdfHeight;
    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightMm, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    return pdf.output('blob');
  }, []);

  const doExport = useCallback(async () => {
    if (!htmlContent || !cvName.trim()) {
      toastMessage.error('Please enter a CV name.');
      return null;
    }

    setIsExporting(true);
    try {
      setExportStep('Generating PDF...');
      const blob = await buildPdfBlob();

      if (blob.size > MAX_FILE_SIZE) {
        toastMessage.error(
          `Exported PDF is ${(blob.size / 1024 / 1024).toFixed(1)}MB (max 10MB). Please reduce CV content and try again.`
        );
        return null;
      }

      setExportStep('Uploading...');
      const safeName = cvName.trim().replace(/[^\w\s.-]/g, '_');
      const fileName = `${safeName}.pdf`;
      const formData = new FormData();
      formData.append('files', new File([blob], fileName, { type: 'application/pdf' }));

      const uploadResult = await uploadFiles(formData).unwrap();
      const uploadedUrl = (Array.isArray(uploadResult) ? uploadResult[0] : uploadResult)?.downloadUrl;
      if (!uploadedUrl) throw new Error('Upload failed');

      setExportStep('Finalizing...');
      const newResume = await exportEnhancement({
        enhancementId,
        payload: { resumeUrl: uploadedUrl, fileName },
      }).unwrap();

      return newResume;
    } catch (err) {
      console.error('Export enhancement error:', err);
      toastMessage.error('Failed to export CV. Please try again.');
      return null;
    } finally {
      setIsExporting(false);
      setExportStep(null);
    }
  }, [htmlContent, cvName, buildPdfBlob, uploadFiles, exportEnhancement, enhancementId]);

  const handleSaveOnly = useCallback(async () => {
    const newResume = await doExport();
    if (newResume) {
      toastMessage.success('CV saved to your library.');
      onClose?.();
    }
  }, [doExport, onClose]);

  const handleSaveAndApply = useCallback(async () => {
    const newResume = await doExport();
    if (newResume) {
      toastMessage.success('CV ready — redirecting to application...');
      onClose?.();
      navigate(`/jobs/${jobId}/application`, {
        state: { preselectedResumeId: newResume.id },
      });
    }
  }, [doExport, onClose, navigate, jobId]);

  const handleDownload = useCallback(async () => {
    if (!htmlContent || !cvName.trim()) {
      toastMessage.error('Please enter a CV name.');
      return;
    }
    setIsExporting(true);
    try {
      setExportStep('Generating PDF...');
      const blob = await buildPdfBlob();

      const safeName = cvName.trim().replace(/[^\w\s.-]/g, '_');
      const fileName = `${safeName}.pdf`;

      // Trigger browser download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toastMessage.success('CV downloaded to your device.');
    } catch (err) {
      console.error('Download CV error:', err);
      toastMessage.error('Failed to download CV. Please try again.');
    } finally {
      setIsExporting(false);
      setExportStep(null);
    }
  }, [htmlContent, cvName, buildPdfBlob]);

  const isBusy = isInitializing || isExporting;
  const canSubmit = !!htmlContent && !!cvName.trim() && !isBusy;

  return (
    <Modal
      open={open}
      onCancel={isBusy ? undefined : onClose}
      footer={null}
      width={1180}
      centered
      destroyOnHidden
      maskClosable={!isBusy}
      closable={false}
      styles={{ body: { padding: 0, maxHeight: '90vh', overflow: 'hidden' } }}
    >
      {/* Hidden print container — native A4 (no transform) used ONLY by html2canvas.
          `printRef` points at this outer wrapper (NOT its child) so that padding is
          included in the captured bitmap. */}
      {htmlContent && (
        <div
          ref={printRef}
          aria-hidden="true"
          className="resume-editor"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: `${A4_WIDTH_PX}px`,
            minHeight: `${A4_HEIGHT_PX}px`,
            background: '#ffffff',
            padding: '40px 50px',
            boxSizing: 'border-box',
            pointerEvents: 'none',
            // Sit behind the document; modal backdrop covers it from the user's view.
            zIndex: -9999,
            visibility: 'hidden',
          }}
        >
          <div
            className="tiptap-content"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      )}

      <div
        className="relative flex flex-col md:flex-row"
        style={{ height: 'min(90vh, 820px)' }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isBusy}
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-40"
        >
          <X size={16} />
        </button>

        {/* Left: Preview — live HTML, crisp & readable */}
        <div className="relative flex-1 md:max-w-[62%] bg-slate-100 border-r border-slate-200 flex flex-col min-h-0">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-white shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
              Preview
            </span>
            <span className="text-[11px] text-slate-500">A4 · PDF</span>
          </div>
          <div className="flex-1 overflow-y-auto p-6 flex justify-center items-start min-h-0">
            {isInitializing && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
                <Loader2 size={28} className="animate-spin text-primary" />
                <span className="text-sm">Loading preview...</span>
              </div>
            )}
            {!isInitializing && htmlContent && (
              /* Fixed-size wrapper at scaled dimensions → parent layout is correct. */
              <div
                style={{
                  width: `${A4_WIDTH_PX * PREVIEW_SCALE}px`,
                  minHeight: `${A4_HEIGHT_PX * PREVIEW_SCALE}px`,
                  flexShrink: 0,
                }}
              >
                <div
                  className="resume-editor shadow-xl border border-slate-200 rounded"
                  style={{
                    width: `${A4_WIDTH_PX}px`,
                    minHeight: `${A4_HEIGHT_PX}px`,
                    background: '#ffffff',
                    padding: '40px 50px',
                    boxSizing: 'border-box',
                    transform: `scale(${PREVIEW_SCALE})`,
                    transformOrigin: 'top left',
                  }}
                >
                  <div
                    className="tiptap-content"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                </div>
              </div>
            )}
            {!isInitializing && !htmlContent && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-sm">
                No content to preview
              </div>
            )}
          </div>
        </div>

        {/* Right: Form */}
        <div className="flex flex-col w-full md:w-[38%] p-6 gap-5 overflow-y-auto min-h-0">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <FileCheck size={20} className="text-primary" />
              Package your tailored CV
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              Save your edited CV as a PDF to your library so you can use it to apply.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-700">
              CV Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={cvName}
              onChange={(e) => setCvName(e.target.value)}
              maxLength={NAME_MAX_LENGTH}
              placeholder="Enter CV name"
              disabled={isBusy}
              showCount
            />
          </div>

          {(jobTitle || companyName) && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-700">Applying for</label>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-neutral-900">
                    {jobTitle || 'Job'}
                  </div>
                  {companyName && (
                    <div className="truncate text-xs text-neutral-500">{companyName}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5">
            <Info size={14} className="mt-0.5 shrink-0 text-blue-500" />
            <p className="text-[11px] leading-relaxed text-blue-700">
              This CV will be saved to your CV library as a PDF and can be reused for other
              applications.
            </p>
          </div>

          {exportStep && (
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
              <Loader2 size={14} className="animate-spin" />
              {exportStep}
            </div>
          )}

          <div className="mt-auto flex flex-col gap-2 pt-2">
            <Tooltip title={!canSubmit ? 'Waiting for content...' : ''}>
              <button
                type="button"
                onClick={handleSaveAndApply}
                disabled={!canSubmit}
                className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-sm"
              >
                <Send size={15} />
                Save & Apply Now
              </button>
            </Tooltip>
            <button
              type="button"
              onClick={handleSaveOnly}
              disabled={!canSubmit}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-neutral-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Save to CV Library
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={!canSubmit}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-neutral-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <Download size={15} />
              Download PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="text-xs text-neutral-500 hover:text-neutral-700 disabled:opacity-40 py-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ExportEnhancementModal;
