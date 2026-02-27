import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import {
  useDeleteCandidateResumeMutation,
  useGetCandidateResumesQuery,
  useLazyGetResumeParseStatusQuery,
  useParseCandidateResumeMutation,
  useSetResumeAsProfileMutation,
  useUploadCandidateResumeMutation,
  useUploadFilesMutation,
} from "@/apis/resumeApi";
import { RESUME_TYPES } from "@/constant";
import FilesList from "./files-list";
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
  const [isConsentChecked, setIsConsentChecked] = useState(false);
  const [isConsentLoading, setIsConsentLoading] = useState(false);

  const { data: resumes = [], isLoading: isLoadingResumes } = useGetCandidateResumesQuery({
    type: RESUME_TYPES.ORIGINAL,
  });
  const [uploadFiles, { isLoading: isUploadingFile }] = useUploadFilesMutation();
  const [uploadCandidateResume, { isLoading: isSavingResume }] = useUploadCandidateResumeMutation();
  const [parseCandidateResume] = useParseCandidateResumeMutation();
  const [triggerResumeParseStatus] = useLazyGetResumeParseStatusQuery();
  const [deleteCandidateResume] = useDeleteCandidateResumeMutation();
  const [setResumeAsProfile, { isLoading: isSettingProfile }] = useSetResumeAsProfileMutation();

  const [settingProfileId, setSettingProfileId] = useState(null);
  const [parseStatusOverrides, setParseStatusOverrides] = useState({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmValue, setConfirmValue] = useState("");
  const [confirmResumeId, setConfirmResumeId] = useState(null);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const files = useMemo(
    () =>
      resumes.map((resume) => {
        const timestamp = resume.resumeUrl?.split("/").pop()?.split("_")[0];
        const uploadTime =
          timestamp && !Number.isNaN(Number(timestamp))
            ? new Date(Number.parseInt(timestamp, 10)).toLocaleString()
            : "Unknown";
        const fileName = resume.fileName || resume.resumeName || "";
        const effectiveStatus = parseStatusOverrides[resume.id] || resume.parseStatus || "WAITING";

        return {
          id: resume.id,
          name: fileName || `Resume #${resume.id}`,
          status: normalizeParseStatus(effectiveStatus),
          type: isPdfFile(fileName) ? "pdf" : "doc",
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
          message.info("Resume parsing is still processing. Please check again in a moment.");
          return;
        }

        try {
          const status = normalizeParseStatus(await triggerResumeParseStatus({ resumeId }).unwrap());
          setParseStatusOverrides((prev) => ({ ...prev, [resumeId]: status }));

          if (TERMINAL_PARSE_STATUSES.has(status)) {
            stopPolling(resumeId);
            if (status === "FINISH") {
              message.success("Resume parsed successfully.");
            } else {
              message.error("Resume parsing failed. Please try parsing again.");
            }
          }
        } catch (error) {
          stopPolling(resumeId);
          message.error(getErrorMessage(error, "Unable to check parse status."));
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
    setIsConsentChecked(false);
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
        message.error(getErrorMessage(error, "Failed to start resume parsing."));
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
      setIsConsentChecked(false);
    } catch (error) {
      message.error(getErrorMessage(error, "Upload resume failed"));
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
    setIsConsentChecked(false);
  };

  const handleConsentSubmit = async () => {
    if (!isConsentChecked || isConsentLoading) return;

    try {
      setIsConsentLoading(true);

      if (consentModal.mode === "upload" && consentModal.pendingUploadPayload) {
        const createdResume = await createUploadedResume(consentModal.pendingUploadPayload);
        const parseStarted = await triggerResumeParsing(createdResume?.id, { silentError: true });
        if (parseStarted) {
          message.success("Upload completed. Resume parsing has started.");
        } else {
          message.warning("Upload completed, but parsing could not start. You can parse this resume manually later.");
        }
      } else if (consentModal.mode === "manual" && consentModal.resumeId) {
        const parseStarted = await triggerResumeParsing(consentModal.resumeId);
        if (parseStarted) {
          message.success("Resume parsing has started.");
        }
      }

      resetConsentModal();
    } catch (error) {
      message.error(getErrorMessage(error, "Unable to continue."));
    } finally {
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
      message.success("Upload completed. You can parse this resume later.");
      resetConsentModal();
    } catch (error) {
      message.error(getErrorMessage(error, "Upload resume failed"));
    } finally {
      setIsConsentLoading(false);
    }
  };

  const handleDeleteResume = async (resumeId) => {
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
      message.success("Delete resume successfully");
    } catch (error) {
      message.error(getErrorMessage(error, "Delete resume failed"));
    } finally {
      setDeletingId(null);
    }
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
      await Promise.all([setResumeAsProfile({ resumeId: confirmResumeId }).unwrap(), delay]);
      message.success("Set profile resume successfully");
      closeSetProfileConfirm();
    } catch (error) {
      message.error(getErrorMessage(error, "Set profile resume failed"));
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
      />

      <ParseConsentModal
        open={consentModal.open}
        mode={consentModal.mode}
        isConsentChecked={isConsentChecked}
        isConsentLoading={isConsentLoading}
        onChangeConsentChecked={setIsConsentChecked}
        onCancel={handleConsentCancel}
        onSubmit={handleConsentSubmit}
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
