import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Input, Tooltip } from 'antd';
import { FileCheck, Send, Info, Loader2, X, Download } from 'lucide-react';
import toastMessage from '@/utils/toastMessage';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const NAME_MAX_LENGTH = 100;

const stripPdfExtension = (value) => {
  if (!value || typeof value !== 'string') return '';
  return value.replace(/\.pdf$/i, '').trim();
};

const buildPdfFileName = (value, fallbackName) => {
  const baseName = stripPdfExtension(value) || stripPdfExtension(fallbackName) || 'Resume';
  const safeName = baseName.replace(/[^\w\s.-]/g, '_').trim() || 'Resume';
  return `${safeName}.pdf`;
};

const ExportCvModal = ({
  open,
  onClose,
  previewImage,
  resumeName: initialResumeName,
  jobId,
  jobTitle,
  companyName,
  onExport, // handles actual generation & upload
}) => {
  const navigate = useNavigate();

  const [cvName, setCvName] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStep, setExportStep] = useState(null);

  useEffect(() => {
    if (open) {
      const baseName = stripPdfExtension(initialResumeName);
      setCvName(baseName || 'My Resume');
    }
  }, [open, initialResumeName]);

  const handleAction = useCallback(async (type) => {
    if (!cvName.trim()) {
      toastMessage.error('Please enter a CV name.');
      return;
    }

    setIsExporting(true);
    try {
      const fileName = buildPdfFileName(cvName.trim(), initialResumeName);

      const result = await onExport({
        type, // 'save', 'apply', 'download'
        cvName: cvName.trim(),
        fileName,
        setStep: setExportStep
      });

      if (result?.success) {
        if (type === 'apply' && jobId) {
          toastMessage.success('CV ready — redirecting to application...');
          onClose();
          navigate(`/jobs/${jobId}/application`, {
            state: { preselectedResumeId: result.resumeId },
          });
        } else if (type === 'save') {
          toastMessage.success('CV saved to your library.');
          onClose();
          navigate('/dashboard/resumes');
        } else if (type === 'download') {
          // handled by parent
          onClose();
        }
      }
    } catch (err) {
      console.error('Export error:', err);
      toastMessage.error('Failed to export CV. Please try again.');
    } finally {
      setIsExporting(false);
      setExportStep(null);
    }
  }, [cvName, initialResumeName, onExport, jobId, navigate, onClose]);

  const isBusy = isExporting;
  const canSubmit = !!cvName.trim() && !isBusy;

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
      <div
        className="relative flex flex-col md:flex-row"
        style={{ height: 'min(90vh, 820px)' }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isBusy}
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-40 shadow-sm"
        >
          <X size={16} />
        </button>

        {/* Left: Preview */}
        <div className="relative flex-1 md:max-w-[62%] bg-slate-100 border-r border-slate-200 flex flex-col min-h-0">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-white shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
              Preview
            </span>
            <span className="text-[11px] text-slate-500">A4 · PDF</span>
          </div>
          <div className="flex-1 overflow-y-auto p-8 flex justify-center items-start min-h-0 bg-slate-50">
            {previewImage ? (
              <div className="shadow-2xl border border-slate-200 bg-white">
                <img
                  src={previewImage}
                  alt="CV Preview"
                  className="w-full h-auto block"
                  style={{ width: '794px' }} // Standard A4 width at 96dpi
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                <Loader2 size={28} className="animate-spin text-primary" />
                <span className="text-sm">Generating preview...</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Form */}
        <div className="flex flex-col w-full md:w-[38%] p-8 gap-6 overflow-y-auto min-h-0 bg-white">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <FileCheck size={24} className="text-primary" />
              Package your CV
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Finalize your CV name and choose where to save it.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Resume Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={cvName}
              onChange={(e) => setCvName(e.target.value)}
              maxLength={NAME_MAX_LENGTH}
              placeholder="e.g., Software Engineer Resume"
              disabled={isBusy}
              showCount
              className="h-11 rounded-lg"
            />
          </div>

          {(jobTitle || companyName) && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Applying for</label>
              <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm border border-blue-100">
                  < LucideIcons.Briefcase size={20} className="text-blue-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-neutral-900">
                    {jobTitle || 'Target Position'}
                  </div>
                  {companyName && (
                    <div className="truncate text-xs font-medium text-blue-600/80">{companyName}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-100 p-4">
            <Info size={18} className="mt-0.5 shrink-0 text-amber-500" />
            <p className="text-xs leading-relaxed text-amber-800">
              This version will be saved as a high-quality PDF to your library for future use.
            </p>
          </div>

          {exportStep && (
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 p-4 text-sm text-slate-600 font-medium animate-pulse">
              <Loader2 size={18} className="animate-spin text-primary" />
              {exportStep}
            </div>
          )}

          <div className="mt-auto flex flex-col gap-3">
            {jobId && (
              <Tooltip title={!canSubmit ? 'Please enter a CV name' : ''}>
                <button
                  type="button"
                  onClick={() => handleAction('apply')}
                  disabled={!canSubmit}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/20 active:scale-[0.98]"
                >
                  <Send size={18} />
                  Save & Apply Now
                </button>
              </Tooltip>
            )}

            <button
              type="button"
              onClick={() => handleAction('save')}
              disabled={!canSubmit}
              className="flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 px-4 text-sm font-bold text-neutral-700 transition-all disabled:opacity-50 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]"
            >
              Save to CV Library
            </button>
            <button
              type="button"
              onClick={() => handleAction('download')}
              disabled={!canSubmit}
              className="flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 px-4 text-sm font-bold text-neutral-700 transition-all disabled:opacity-50 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]"
            >
              <Download size={18} />
              Download PDF Only
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Internal LucideIcons for the modal
const LucideIcons = {
  Briefcase: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
};

export default ExportCvModal;
