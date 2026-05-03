import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "antd";
import toastMessage from "@/utils/toastMessage";
import {
  useDeleteCandidateResumeMutation,
  useGetCandidateResumesQuery,
  useLazyGetResumeParseStatusQuery,
} from "@/apis/resumeApi";
import { useGetFeatureUsageQuery } from "@/apis/featureUsageApi";
import { RESUME_TYPES } from "@/constant";
import useCandidateResumeWorkflow from "@/hooks/useCandidateResumeWorkflow";
import FilesList from "./files-list";
import RenameResumeModal from "../../components/RenameResumeModal";
// [FREE PARSING] Consent modal no longer needed - parsing is free and auto-triggered
// import ParseConsentModal from "./parse-consent-modal";
import SetProfileConfirmModal from "./set-profile-confirm-modal";
import ParsedResultModal from "./parsed-result-modal";
import UploadPanel from "./upload-panel";
import ReplaceResumeModal from "./replace-resume-modal";
import {
  POLL_INTERVAL_MS,
  POLL_TIMEOUT_MS,
  TERMINAL_PARSE_STATUSES,
  getErrorMessage,
  isPdfFile,
  normalizeParseStatus,
} from "@/constant/attachment";

const AttachmentsTab = () => {
  const inputRef = useRef(null);
  const pollingTimersRef = useRef({});
  const pollingStartTimesRef = useRef({});

  const [deletingId, setDeletingId] = useState(null);
  const [activeParsingResumeId, setActiveParsingResumeId] = useState(null);
  const [pollingByResumeId, setPollingByResumeId] = useState({});

  // [FREE PARSING] Consent modal state no longer needed
//  const [consentModal, setConsentModal] = useState({
//    open: false,
//    mode: null,
//    pendingUploadPayload: null,
//    resumeId: null,
//  });
//  const [isConsentLoading, setIsConsentLoading] = useState(false);
  const [replaceModal, setReplaceModal] = useState({ open: false, pendingUploadPayload: null });

  const { data: featureUsageData } = useGetFeatureUsageQuery();

  const uploadFeature = useMemo(
    () => (featureUsageData || []).find((item) => item?.featureKey === "CV_UPLOAD_LIMIT"),
    [featureUsageData]
  );
  const uploadExhausted = uploadFeature?.maxQuota != null && uploadFeature?.remaining === 0;

  const { data: resumes = [], isLoading: isLoadingResumes } = useGetCandidateResumesQuery({
    type: RESUME_TYPES.ORIGINAL,
  });
  const [triggerResumeParseStatus] = useLazyGetResumeParseStatusQuery();
  const [deleteCandidateResume] = useDeleteCandidateResumeMutation();
  const {
    uploadResumeAsset,
    createUploadedResume,
    startResumeParsing,
    assignResumeAsProfile,
    isUploadingAsset,
    isCreatingResume,
    isSettingResumeAsProfile,
  } = useCandidateResumeWorkflow();

  const [settingProfileId, setSettingProfileId] = useState(null);
  const [parseStatusOverrides, setParseStatusOverrides] = useState({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmResumeId, setConfirmResumeId] = useState(null);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [renameResume, setRenameResume] = useState(null);
  const [previewResumeId, setPreviewResumeId] = useState(null);

  const files = useMemo(
    () =>
      resumes.map((resume) => {
        const timestamp = resume.resumeUrl?.split("/").pop()?.split("_")[0];
        const uploadTime =
          timestamp && !Number.isNaN(Number(timestamp))
            ? new Date(Number.parseInt(timestamp, 10)).toLocaleString()
            : "Unknown";
        const effectiveStatus = parseStatusOverrides[resume.id] || resume.parseStatus || "WAITING";

        return {
          id: resume.id,
          name: resume.resumeName || `Resume #${resume.id}`,
          fileName: resume.fileName || "",
          status: normalizeParseStatus(effectiveStatus),
          type: isPdfFile(resume.fileName || "") ? "pdf" : "doc",
          url: resume.resumeUrl,
          uploadTime,
        };
      }),
    [parseStatusOverrides, resumes]
  );

  const stopPolling = useCallback((resumeId) => {
    if (pollingTimersRef.current[resumeId]) {
      clearInterval(pollingTimersRef.current[resumeId]);
      delete pollingTimersRef.current[resumeId];
    }

    delete pollingStartTimesRef.current[resumeId];
    setPollingByResumeId((prev) => {
      if (!prev[resumeId]) return prev;
      const next = { ...prev };
      delete next[resumeId];
      return next;
    });
  }, []);

  useEffect(() => {
    setParseStatusOverrides((prev) => {
      const previousEntries = Object.entries(prev);
      if (previousEntries.length === 0) return prev;

      const resumeIdSet = new Set(resumes.map((resume) => resume.id));
      let changed = false;
      const next = {};

      previousEntries.forEach(([resumeId, status]) => {
        if (resumeIdSet.has(Number.parseInt(resumeId, 10))) {
          next[resumeId] = status;
        } else {
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [resumes]);

  const startPolling = useCallback(
    (resumeId) => {
      if (!resumeId || pollingTimersRef.current[resumeId]) return;

      pollingStartTimesRef.current[resumeId] = Date.now();
      setPollingByResumeId((prev) => ({ ...prev, [resumeId]: true }));

      const pollStatus = async () => {
        const startedAt = pollingStartTimesRef.current[resumeId];
        if (!startedAt) {
          stopPolling(resumeId);
          return;
        }

        if (Date.now() - startedAt >= POLL_TIMEOUT_MS) {
          stopPolling(resumeId);
          toastMessage.info("Resume parsing is still processing. Please check again in a moment.");
          return;
        }

        try {
          const status = normalizeParseStatus(await triggerResumeParseStatus({ resumeId }).unwrap());
          setParseStatusOverrides((prev) => ({ ...prev, [resumeId]: status }));

          if (TERMINAL_PARSE_STATUSES.has(status)) {
            stopPolling(resumeId);
          }
        } catch (error) {
          stopPolling(resumeId);
          toastMessage.error(getErrorMessage(error, "Unable to check parse status."));
        }
      };

      void pollStatus();
      pollingTimersRef.current[resumeId] = setInterval(() => {
        void pollStatus();
      }, POLL_INTERVAL_MS);
    },
    [stopPolling, triggerResumeParseStatus]
  );

  useEffect(() => {
    const partialResumeIds = files
      .filter((file) => file.status === "PARTIAL" || Boolean(pollingByResumeId[file.id]))
      .map((file) => file.id);

    partialResumeIds.forEach((resumeId) => startPolling(resumeId));

    Object.keys(pollingTimersRef.current).forEach((idKey) => {
      const resumeId = Number.parseInt(idKey, 10);
      if (!partialResumeIds.includes(resumeId)) {
        stopPolling(resumeId);
      }
    });
  }, [files, pollingByResumeId, startPolling, stopPolling]);

  useEffect(
    () => () => {
      Object.values(pollingTimersRef.current).forEach((timer) => clearInterval(timer));
      pollingTimersRef.current = {};
      pollingStartTimesRef.current = {};
    },
    []
  );

  // [FREE PARSING] Consent modal reset no longer needed
//  const resetConsentModal = () => {
//    setConsentModal({
//      open: false,
//      mode: null,
//      pendingUploadPayload: null,
//      resumeId: null,
//    });
//  };

  const triggerResumeParsing = async (resumeId, { silentError = false } = {}) => {
    if (!resumeId) return false;
    setActiveParsingResumeId(resumeId);

    try {
      await startResumeParsing(resumeId);
      setParseStatusOverrides((prev) => ({ ...prev, [resumeId]: "PARTIAL" }));
      startPolling(resumeId);
      return true;
    } catch (error) {
      if (!silentError) {
        toastMessage.error(getErrorMessage(error, "Failed to start resume parsing."));
      }
      return false;
    } finally {
      setActiveParsingResumeId(null);
    }
  };

  const handleUploadFile = async (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    try {
      const { payload } = await uploadResumeAsset(selectedFile);

      if (uploadExhausted) {
        setReplaceModal({ open: true, pendingUploadPayload: payload });
      } else {
        // [FREE PARSING] Auto-parse on upload - no consent modal
//        setConsentModal({
//          open: true,
//          mode: "upload",
//          pendingUploadPayload: payload,
//          resumeId: null,
//        });
        try {
          const createdResume = await createUploadedResume(payload);
          const parseStarted = await triggerResumeParsing(createdResume?.id, { silentError: true });
          if (parseStarted) {
            toastMessage.success("Upload completed. Resume parsing has started.");
          } else {
            toastMessage.warning("Upload completed, but parsing could not start. You can parse this resume manually later.");
          }
        } catch (error) {
          toastMessage.error(getErrorMessage(error, "Upload resume failed"));
        }
      }
    } catch (error) {
      toastMessage.error(getErrorMessage(error, "Upload resume failed"));
    } finally {
      event.target.value = "";
    }
  };

  // [FREE PARSING] Consent modal no longer needed - parse directly
//  const openParseConsent = (resumeId) => {
//    setConsentModal({
//      open: true,
//      mode: "manual",
//      pendingUploadPayload: null,
//      resumeId,
//    });
//  };

  // [FREE PARSING] Consent modal handlers no longer needed
//  const handleConsentSubmit = async () => {
//    if (isConsentLoading) return;
//
//    try {
//      setIsConsentLoading(true);
//
//      if (consentModal.mode === "upload" && consentModal.pendingUploadPayload) {
//        const createdResume = await createUploadedResume(consentModal.pendingUploadPayload);
//        const parseStarted = await triggerResumeParsing(createdResume?.id, { silentError: true });
//        if (parseStarted) {
//          toastMessage.success("Upload completed. Resume parsing has started.");
//        } else {
//          toastMessage.warning("Upload completed, but parsing could not start. You can parse this resume manually later.");
//        }
//      } else if (consentModal.mode === "manual" && consentModal.resumeId) {
//        const parseStarted = await triggerResumeParsing(consentModal.resumeId);
//        if (parseStarted) {
//          toastMessage.success("Resume parsing has started.");
//        }
//      }
//    } catch (error) {
//      toastMessage.error(getErrorMessage(error, "Unable to continue."));
//    } finally {
//      resetConsentModal();
//      setIsConsentLoading(false);
//    }
//  };
//
//  const handleConsentCancel = async () => {
//    if (isConsentLoading) return;
//
//    if (consentModal.mode !== "upload" || !consentModal.pendingUploadPayload) {
//      resetConsentModal();
//      return;
//    }
//
//    try {
//      setIsConsentLoading(true);
//      await createUploadedResume(consentModal.pendingUploadPayload);
//      toastMessage.success("Upload resume successfully");
//    } catch (error) {
//      toastMessage.error(getErrorMessage(error, "Upload resume failed"));
//    } finally {
//      resetConsentModal();
//      setIsConsentLoading(false);
//    }
//  };

  const handleReplaceSelect = async (resumeIdToDelete) => {
    try {
      stopPolling(resumeIdToDelete);
      await deleteCandidateResume({ resumeId: resumeIdToDelete }).unwrap();

      const payload = replaceModal.pendingUploadPayload;
      setReplaceModal({ open: false, pendingUploadPayload: null });
      // [FREE PARSING] Auto-parse after replace - no consent modal
//      setConsentModal({ open: true, mode: "upload", pendingUploadPayload: payload, resumeId: null });
      const createdResume = await createUploadedResume(payload);
      const parseStarted = await triggerResumeParsing(createdResume?.id, { silentError: true });
      if (parseStarted) {
        toastMessage.success("Upload completed. Resume parsing has started.");
      } else {
        toastMessage.warning("Upload completed, but parsing could not start. You can parse this resume manually later.");
      }
    } catch (error) {
      toastMessage.error(getErrorMessage(error, "Failed to replace resume."));
    }
  };

  const handleReplaceCancel = () => {
    setReplaceModal({ open: false, pendingUploadPayload: null });
  };

  const handleDeleteResume = (resumeId) => {
    const resume = resumes.find((r) => r.id === resumeId);
    const resumeName = resume?.resumeName || `Resume #${resumeId}`;

    Modal.confirm({
      title: "Delete Resume",
      content: `Are you sure you want to delete "${resumeName}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          setDeletingId(resumeId);
          stopPolling(resumeId);
          setParseStatusOverrides((prev) => {
            if (prev[resumeId] == null) return prev;
            const next = { ...prev };
            delete next[resumeId];
            return next;
          });
          await deleteCandidateResume({ resumeId }).unwrap();
          toastMessage.success("Delete resume successfully");
        } catch (error) {
          toastMessage.error(getErrorMessage(error, "Delete resume failed"));
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  const openSetProfileConfirm = (resumeId) => {
    setConfirmResumeId(resumeId);
    setIsConfirmOpen(true);
  };

  const closeSetProfileConfirm = () => {
    if (isSettingResumeAsProfile) return;
    setIsConfirmOpen(false);
    setConfirmResumeId(null);
  };

  const handleConfirmSetProfile = async () => {
    if (!confirmResumeId) return;

    try {
      setIsConfirmLoading(true);
      setSettingProfileId(confirmResumeId);
      const delay = new Promise((resolve) => setTimeout(resolve, 800));
      await Promise.all([assignResumeAsProfile(confirmResumeId), delay]);
      toastMessage.success("Set profile resume successfully");
      closeSetProfileConfirm();
    } catch (error) {
      toastMessage.error(getErrorMessage(error, "Set profile resume failed"));
    } finally {
      setIsConfirmLoading(false);
      setSettingProfileId(null);
    }
  };

  const isUploading = isUploadingAsset || isCreatingResume;

  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Attached resume (PDF/DOC/DOCX)</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload your latest CV for job applications.</p>
        </div>
      </div>

      <UploadPanel inputRef={inputRef} isUploading={isUploading} onUploadFile={handleUploadFile} exhausted={uploadExhausted} />

      <FilesList
        files={files}
        isLoadingResumes={isLoadingResumes}
        pollingByResumeId={pollingByResumeId}
        activeParsingResumeId={activeParsingResumeId}
        deletingId={deletingId}
        isSettingProfile={isSettingResumeAsProfile}
        settingProfileId={settingProfileId}
        onOpenParseConsent={(resumeId) => triggerResumeParsing(resumeId)}
        onOpenSetProfileConfirm={openSetProfileConfirm}
        onDeleteResume={handleDeleteResume}
        onViewParsedResult={(id) => setPreviewResumeId(id)}
        onRename={(fileId) => {
          const resume = resumes.find((r) => r.id === fileId);
          if (resume) setRenameResume(resume);
        }}
        uploadQuota={uploadFeature?.maxQuota != null ? {
          used: uploadFeature.maxQuota - (uploadFeature.remaining ?? 0),
          max: uploadFeature.maxQuota,
          exhausted: uploadExhausted,
        } : null}
      />

      {/* [FREE PARSING] Consent modal no longer needed */}
      {/*<ParseConsentModal
        open={consentModal.open}
        mode={consentModal.mode}
        isConsentLoading={isConsentLoading}
        onCancel={handleConsentCancel}
        onSubmit={handleConsentSubmit}
        featureUsageData={featureUsageData}
      />*/}

      <RenameResumeModal
        open={Boolean(renameResume)}
        onClose={() => setRenameResume(null)}
        resume={renameResume}
      />

      <ReplaceResumeModal
        open={replaceModal.open}
        files={files}
        loading={false}
        onSelect={handleReplaceSelect}
        onCancel={handleReplaceCancel}
      />

      <ParsedResultModal
        open={Boolean(previewResumeId)}
        resumeId={previewResumeId}
        onClose={() => setPreviewResumeId(null)}
        onSetAsProfile={async (id) => {
          setPreviewResumeId(null);
          setConfirmResumeId(id);
          try {
            setIsConfirmLoading(true);
            setSettingProfileId(id);
            const delay = new Promise((resolve) => setTimeout(resolve, 800));
            await Promise.all([assignResumeAsProfile(id), delay]);
            toastMessage.success("Set profile resume successfully");
          } catch (error) {
            toastMessage.error(getErrorMessage(error, "Set profile resume failed"));
          } finally {
            setIsConfirmLoading(false);
            setSettingProfileId(null);
            setConfirmResumeId(null);
          }
        }}
      />

      <SetProfileConfirmModal
        open={isConfirmOpen}
        resumeId={confirmResumeId}
        isSettingProfile={isSettingResumeAsProfile}
        isConfirmLoading={isConfirmLoading}
        onCancel={closeSetProfileConfirm}
        onConfirm={handleConfirmSetProfile}
      />
    </section>
  );
};

export default AttachmentsTab;
