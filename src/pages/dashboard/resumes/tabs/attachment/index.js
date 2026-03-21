import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "antd";
import toastMessage from "@/utils/toastMessage";
import {
  useDeleteCandidateResumeMutation,
  useGetCandidateResumesQuery,
  useLazyGetResumeParseStatusQuery,
  useParseCandidateResumeMutation,
  useSetResumeAsDefaultMutation,
  useUploadCandidateResumeMutation,
  useUploadFilesMutation,
} from "@/apis/resumeApi";
import { RESUME_TYPES } from "@/constant";
import FilesList from "./files-list";
import RenameResumeModal from "../../components/RenameResumeModal";
import ParseConsentModal from "./parse-consent-modal";
import SetProfileConfirmModal from "./set-profile-confirm-modal";
import UploadPanel from "./upload-panel";
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

  const [consentModal, setConsentModal] = useState({
    open: false,
    mode: null,
    pendingUploadPayload: null,
    resumeId: null,
  });
  const [isConsentLoading, setIsConsentLoading] = useState(false);

  const { data: resumes = [], isLoading: isLoadingResumes } = useGetCandidateResumesQuery({
    type: RESUME_TYPES.ORIGINAL,
  });
  const [uploadFiles, { isLoading: isUploadingFile }] = useUploadFilesMutation();
  const [uploadCandidateResume, { isLoading: isSavingResume }] = useUploadCandidateResumeMutation();
  const [parseCandidateResume] = useParseCandidateResumeMutation();
  const [triggerResumeParseStatus] = useLazyGetResumeParseStatusQuery();
  const [deleteCandidateResume] = useDeleteCandidateResumeMutation();
  const [setResumeAsDefault, { isLoading: isSettingProfile }] = useSetResumeAsDefaultMutation();

  const [settingProfileId, setSettingProfileId] = useState(null);
  const [parseStatusOverrides, setParseStatusOverrides] = useState({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmValue, setConfirmValue] = useState("");
  const [confirmResumeId, setConfirmResumeId] = useState(null);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [renameResume, setRenameResume] = useState(null);

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

  const resetConsentModal = () => {
    setConsentModal({
      open: false,
      mode: null,
      pendingUploadPayload: null,
      resumeId: null,
    });
  };

  const createUploadedResume = async (payload) => uploadCandidateResume(payload).unwrap();

  const triggerResumeParsing = async (resumeId, { silentError = false } = {}) => {
    if (!resumeId) return false;
    setActiveParsingResumeId(resumeId);

    try {
      await parseCandidateResume({ resumeId }).unwrap();
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
      const formData = new FormData();
      formData.append("files", selectedFile);

      const uploadResponses = await uploadFiles(formData).unwrap();
      const uploadedFile = Array.isArray(uploadResponses) ? uploadResponses[0] : null;

      if (!uploadedFile?.downloadUrl) {
        throw new Error("Upload file failed");
      }

      const payload = {
        resumeName: selectedFile.name,
        fileName: uploadedFile.originalFileName || selectedFile.name,
        resumeUrl: uploadedFile.downloadUrl,
      };

      setConsentModal({
        open: true,
        mode: "upload",
        pendingUploadPayload: payload,
        resumeId: null,
      });
    } catch (error) {
      toastMessage.error(getErrorMessage(error, "Upload resume failed"));
    } finally {
      event.target.value = "";
    }
  };

  const openParseConsent = (resumeId) => {
    setConsentModal({
      open: true,
      mode: "manual",
      pendingUploadPayload: null,
      resumeId,
    });
  };

  const handleConsentSubmit = async () => {
    if (isConsentLoading) return;

    try {
      setIsConsentLoading(true);

      if (consentModal.mode === "upload" && consentModal.pendingUploadPayload) {
        const createdResume = await createUploadedResume(consentModal.pendingUploadPayload);
        const parseStarted = await triggerResumeParsing(createdResume?.id, { silentError: true });
        if (parseStarted) {
          toastMessage.success("Upload completed. Resume parsing has started.");
        } else {
          toastMessage.warning("Upload completed, but parsing could not start. You can parse this resume manually later.");
        }
      } else if (consentModal.mode === "manual" && consentModal.resumeId) {
        const parseStarted = await triggerResumeParsing(consentModal.resumeId);
        if (parseStarted) {
          toastMessage.success("Resume parsing has started.");
        }
      }
    } catch (error) {
      toastMessage.error(getErrorMessage(error, "Unable to continue."));
    } finally {
      resetConsentModal();
      setIsConsentLoading(false);
    }
  };

  const handleConsentCancel = async () => {
    if (isConsentLoading) return;

    if (consentModal.mode !== "upload" || !consentModal.pendingUploadPayload) {
      resetConsentModal();
      return;
    }

    try {
      setIsConsentLoading(true);
      await createUploadedResume(consentModal.pendingUploadPayload);
      toastMessage.success("Upload resume successfully");
    } catch (error) {
      toastMessage.error(getErrorMessage(error, "Upload resume failed"));
    } finally {
      resetConsentModal();
      setIsConsentLoading(false);
    }
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
    setConfirmValue("");
    setIsConfirmOpen(true);
  };

  const closeSetProfileConfirm = () => {
    if (isSettingProfile) return;
    setIsConfirmOpen(false);
    setConfirmResumeId(null);
    setConfirmValue("");
  };

  const handleConfirmSetProfile = async () => {
    if (!confirmResumeId) return;

    try {
      setIsConfirmLoading(true);
      setSettingProfileId(confirmResumeId);
      const delay = new Promise((resolve) => setTimeout(resolve, 800));
      await Promise.all([setResumeAsDefault({ resumeId: confirmResumeId }).unwrap(), delay]);
      toastMessage.success("Set profile resume successfully");
      closeSetProfileConfirm();
    } catch (error) {
      toastMessage.error(getErrorMessage(error, "Set profile resume failed"));
    } finally {
      setIsConfirmLoading(false);
      setSettingProfileId(null);
    }
  };

  const isUploading =
    isUploadingFile || isSavingResume || (consentModal.mode === "upload" && isConsentLoading);
  const canConfirmSetProfile = confirmValue.trim().toLowerCase() === "continue";

  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Attached resume (PDF/DOC/DOCX)</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload your latest CV for job applications.</p>
        </div>
      </div>

      <UploadPanel inputRef={inputRef} isUploading={isUploading} onUploadFile={handleUploadFile} />

      <FilesList
        files={files}
        isLoadingResumes={isLoadingResumes}
        pollingByResumeId={pollingByResumeId}
        activeParsingResumeId={activeParsingResumeId}
        deletingId={deletingId}
        isSettingProfile={isSettingProfile}
        settingProfileId={settingProfileId}
        onOpenParseConsent={openParseConsent}
        onOpenSetProfileConfirm={openSetProfileConfirm}
        onDeleteResume={handleDeleteResume}
        onRename={(fileId) => {
          const resume = resumes.find((r) => r.id === fileId);
          if (resume) setRenameResume(resume);
        }}
      />

      <ParseConsentModal
        open={consentModal.open}
        mode={consentModal.mode}
        isConsentLoading={isConsentLoading}
        onCancel={handleConsentCancel}
        onSubmit={handleConsentSubmit}
      />

      <RenameResumeModal
        open={Boolean(renameResume)}
        onClose={() => setRenameResume(null)}
        resume={renameResume}
      />

      <SetProfileConfirmModal
        open={isConfirmOpen}
        confirmValue={confirmValue}
        isSettingProfile={isSettingProfile}
        isConfirmLoading={isConfirmLoading}
        canConfirmSetProfile={canConfirmSetProfile}
        onChangeConfirmValue={setConfirmValue}
        onCancel={closeSetProfileConfirm}
        onConfirm={handleConfirmSetProfile}
      />
    </section>
  );
};

export default AttachmentsTab;
