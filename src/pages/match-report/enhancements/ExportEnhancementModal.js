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

// Page padding (matches the `.resume-editor` container below): 40px top/bottom, 50px sides.
const PAGE_PAD_Y = 40;
const PAGE_PAD_X = 50;
// Usable content height per page after subtracting top AND bottom padding.
const PAGE_USABLE_HEIGHT = A4_HEIGHT_PX - PAGE_PAD_Y * 2;

/**
 * Distribute an HTML string into an array of per-page HTML chunks so that each
 * page fits within `PAGE_USABLE_HEIGHT` and no top-level element is sliced in half
 * at a page boundary. Runs a single off-screen measurement pass.
 *
 * Limitation: if a single top-level child is taller than one page (e.g. a giant
 * table), it is placed alone on its own page and will overflow-clip at the bottom.
 * That is a rare authoring edge case and matches the pre-existing behavior for
 * oversized blocks.
 */
const distributeHtmlIntoPages = (html) => {
  if (!html || typeof document === 'undefined') return [html || ''];

  const measure = document.createElement('div');
  measure.className = 'resume-editor';
  measure.style.cssText = [
    'position: fixed',
    'left: -99999px',
    'top: 0',
    `width: ${A4_WIDTH_PX}px`,
    `padding: ${PAGE_PAD_Y}px ${PAGE_PAD_X}px`,
    'box-sizing: border-box',
    'background: #fff',
    'visibility: hidden',
    'pointer-events: none',
  ].join(';');

  const inner = document.createElement('div');
  inner.className = 'tiptap-content';
  inner.innerHTML = html;
  measure.appendChild(inner);
  document.body.appendChild(measure);

  try {
    const children = Array.from(inner.children);
    if (children.length === 0) return [html];

    const pages = [[]];
    let currentHeight = 0;
    for (const child of children) {
      const cs = window.getComputedStyle(child);
      const mt = parseFloat(cs.marginTop) || 0;
      const mb = parseFloat(cs.marginBottom) || 0;
      const blockHeight = child.offsetHeight + mt + mb;

      const currentPage = pages[pages.length - 1];
      if (
        currentPage.length > 0 &&
        currentHeight + blockHeight > PAGE_USABLE_HEIGHT
      ) {
        pages.push([]);
        currentHeight = 0;
      }
      pages[pages.length - 1].push(child.outerHTML);
      currentHeight += blockHeight;
    }

    return pages.map((group) => group.join(''));
  } finally {
    document.body.removeChild(measure);
  }
};

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
  const [pagesHtml, setPagesHtml] = useState([]);
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

  // Init on open: save latest editor content and load it into preview, then
  // distribute the content into A4 pages so each page has proper top + bottom padding.
  useEffect(() => {
    if (!open) return;
    setCvName(defaultCvName);
    if (!editor || !enhancementId) return;

    setIsInitializing(true);
    const html = editor.getHTML();
    const applyHtml = () => {
      setHtmlContent(html);
      setPagesHtml(distributeHtmlIntoPages(html));
    };
    updateContent({ id: enhancementId, content: html })
      .unwrap()
      .then(applyHtml)
      .catch(() => {
        // Even if save fails, still show preview from current editor content
        applyHtml();
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
    // Scale 3 gives crisp text while keeping output under ~2MB for a typical CV.
    const canvas = await html2canvas(container, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      foreignObjectRendering: false,
      imageTimeout: 0,
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

    // Quality 0.95 for crisp text; with scale 3 a typical CV is ~1-2MB.
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
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
          Renders a vertical stack of exact A4 page divs. Total height equals
          `pagesHtml.length × A4_HEIGHT_PX`, so the existing slicing loop in
          `buildPdfBlob` lands each slice on a page that already has its top +
          bottom padding baked in. */}
      {pagesHtml.length > 0 && (
        <div
          ref={printRef}
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: `${A4_WIDTH_PX}px`,
            background: '#ffffff',
            pointerEvents: 'none',
            zIndex: -9999,
            visibility: 'hidden',
          }}
        >
          {pagesHtml.map((pageHtml, i) => (
            <div
              key={i}
              className="resume-editor"
              style={{
                width: `${A4_WIDTH_PX}px`,
                height: `${A4_HEIGHT_PX}px`,
                background: '#ffffff',
                padding: `${PAGE_PAD_Y}px ${PAGE_PAD_X}px`,
                boxSizing: 'border-box',
                overflow: 'hidden',
              }}
            >
              <div
                className="tiptap-content"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: pageHtml }}
              />
            </div>
          ))}
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
            {!isInitializing && pagesHtml.length > 0 && (
              /* Vertical stack of real A4 page divs — each has its own top +
                 bottom padding, so the preview is pixel-accurate to the exported
                 PDF (which rasterizes this exact same layout via the hidden
                 container above). */
              <div className="flex flex-col items-center gap-6">
                {pagesHtml.map((pageHtml, i) => (
                  <div
                    key={i}
                    style={{
                      width: `${A4_WIDTH_PX * PREVIEW_SCALE}px`,
                      height: `${A4_HEIGHT_PX * PREVIEW_SCALE}px`,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      className="resume-editor shadow-xl border border-slate-200 rounded bg-white"
                      style={{
                        width: `${A4_WIDTH_PX}px`,
                        height: `${A4_HEIGHT_PX}px`,
                        padding: `${PAGE_PAD_Y}px ${PAGE_PAD_X}px`,
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                        transform: `scale(${PREVIEW_SCALE})`,
                        transformOrigin: 'top left',
                      }}
                    >
                      <div
                        className="tiptap-content"
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{ __html: pageHtml }}
                      />
                    </div>
                  </div>
                ))}
                <div className="text-[11px] text-slate-400 pb-2">
                  {pagesHtml.length === 1 ? 'Page 1' : `Pages 1–${pagesHtml.length}`} · A4
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
