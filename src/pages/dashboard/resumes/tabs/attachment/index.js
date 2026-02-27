import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Loading from "@/components/Loading";
import ProfileSectionModal from "@/components/ProfileSectionModal";
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

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 90_000;
const TERMINAL_PARSE_STATUSES = new Set(["FINISH", "FAIL"]);

const PARSE_STATUS_META = {
  WAITING: {
    label: "Not parsed",
    className: "border-gray-200 bg-gray-100 text-gray-600",
  },
  PARTIAL: {
    label: "Parsing...",
    className: "border-amber-200 bg-amber-100 text-amber-700",
  },
  FINISH: {
    label: "Parsed",
    className: "border-emerald-200 bg-emerald-100 text-emerald-700",
  },
  FAIL: {
    label: "Parse failed",
    className: "border-red-200 bg-red-100 text-red-700",
  },
};

const getErrorMessage = (error, fallbackMessage) =>
  error?.data?.message || error?.message || fallbackMessage;

const normalizeParseStatus = (status) =>
  typeof status === "string" ? status.toUpperCase() : "WAITING";

const isPdfFile = (fileName = "") => fileName.toLowerCase().endsWith(".pdf");

const getParseStatusView = (status, isPolling) => {
  if (isPolling) {
    return PARSE_STATUS_META.PARTIAL;
  }
  return PARSE_STATUS_META[normalizeParseStatus(status)] || PARSE_STATUS_META.WAITING;
};

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

      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleUploadFile}
        />
        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 px-6 py-14 text-center hover:border-primary transition-colors disabled:cursor-not-allowed disabled:opacity-70"
        >
          <div className="bg-blue-50 dark:bg-blue-900/20 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-icons-round text-[28px] text-blue-500 dark:text-blue-400">cloud_upload</span>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {isUploading ? "Uploading..." : "Click to upload or drag and drop"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF, DOC, or DOCX up to 10MB</p>
        </button>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Attached Files</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">{files.length} file(s)</span>
        </div>

        {isLoadingResumes ? (
          <Loading size={90} className="py-4" />
        ) : files.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No attached resume yet.</p>
        ) : (
          <div className="space-y-3">
            {files.map((file) => {
              const isPolling = Boolean(pollingByResumeId[file.id]);
              const statusView = getParseStatusView(file.status, isPolling);
              const normalizedStatus = normalizeParseStatus(file.status);
              const isParseBusy = isPolling || normalizedStatus === "PARTIAL" || activeParsingResumeId === file.id;
              const canSetAsProfile = normalizedStatus === "FINISH";
              const parseActionLabel = normalizedStatus === "FINISH" ? "Re-parse" : "Parse resume";

              return (
                <div
                  key={file.id}
                  className="flex items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-none">
                      <span className={`material-icons-round ${file.type === "pdf" ? "text-red-500" : "text-blue-500"}`}>
                        {file.type === "pdf" ? "picture_as_pdf" : "description"}
                      </span>
                    </div>
                    <div className="min-w-0">
                      {file.url ? (
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-gray-900 dark:text-white truncate hover:text-primary hover:underline block cursor-pointer"
                        >
                          {file.name}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                      )}
                      <div className="mt-1 flex items-center gap-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Uploaded: {file.uploadTime}</p>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusView.className}`}
                        >
                          {(isPolling || normalizedStatus === "PARTIAL") && (
                            <i className="material-icons-round animate-spin text-[12px] leading-none">autorenew</i>
                          )}
                          {statusView.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-none">
                    <Button
                      mode="ghost"
                      size="sm"
                      shape="rounded"
                      btnIcon
                      tooltip="Download"
                      disabled={!file.url}
                      onClick={() => file.url && window.open(file.url, "_blank", "noopener,noreferrer")}
                    >
                      <i className="material-icons-round text-[18px]">download</i>
                    </Button>

                    <Button
                      mode="ghost"
                      size="sm"
                      shape="rounded"
                      btnIcon
                      tooltip={parseActionLabel}
                      disabled={isParseBusy}
                      onClick={() => openParseConsent(file.id)}
                    >
                      <i className="material-icons-round text-[18px]">psychology</i>
                    </Button>

                    <Button
                      mode="ghost"
                      size="sm"
                      shape="rounded"
                      btnIcon
                      tooltip={canSetAsProfile ? "Set as profile" : "Only parsed resume can be set as profile"}
                      disabled={!canSetAsProfile || isSettingProfile || settingProfileId === file.id}
                      onClick={() => openSetProfileConfirm(file.id)}
                    >
                      <i className="material-icons-round text-[18px]">account_circle</i>
                    </Button>
                    <Button
                      mode="ghost"
                      size="sm"
                      shape="rounded"
                      btnIcon
                      tooltip="Delete"
                      disabled={deletingId === file.id}
                      onClick={() => handleDeleteResume(file.id)}
                    >
                      <i className="material-icons-round text-[18px]">delete</i>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ProfileSectionModal
        open={consentModal.open}
        title="Parse resume with AI"
        onCancel={handleConsentCancel}
        loading={isConsentLoading}
        loadingText="Processing..."
        submitText="Parse now"
        submitDisabled={!isConsentChecked || isConsentLoading}
        cancelText={consentModal.mode === "upload" ? "Skip for now" : "Cancel"}
        width={620}
        formId="parse-resume-consent-form"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-700">Parsing your resume enables:</p>
          <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
            <li>Using this resume as a profile source.</li>
            <li>AI scoring for resume matching against job descriptions.</li>
            <li>Importing data into CV Builder for faster editing.</li>
          </ul>

          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <Checkbox
              id="resume-parse-consent-checkbox"
              checked={isConsentChecked}
              onChange={(event) => setIsConsentChecked(Boolean(event?.target?.checked))}
              label="I agree to let Smart Recruit AI access and use data in this resume file for parsing features."
            />
          </div>

          {consentModal.mode === "upload" && (
            <p className="text-xs text-gray-500">
              You can skip now and parse later using the Parse resume action in this list.
            </p>
          )}

          <form
            id="parse-resume-consent-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (isConsentChecked && !isConsentLoading) {
                void handleConsentSubmit();
              }
            }}
          />
        </div>
      </ProfileSectionModal>

      <ProfileSectionModal
        open={isConfirmOpen}
        title="Set resume as profile"
        onCancel={closeSetProfileConfirm}
        loading={isSettingProfile || isConfirmLoading}
        loadingText="Processing..."
        submitText="Continue"
        submitDisabled={!canConfirmSetProfile || isSettingProfile || isConfirmLoading}
        cancelText="Cancel"
        width={520}
        formId="set-profile-confirm-form"
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            This action will override all of your current profile information.
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="font-semibold">continue</span> to confirm
            </label>
            <form
              id="set-profile-confirm-form"
              onSubmit={(event) => {
                event.preventDefault();
                if (canConfirmSetProfile && !isSettingProfile) {
                  void handleConfirmSetProfile();
                }
              }}
            >
              <input
                type="text"
                value={confirmValue}
                onChange={(event) => setConfirmValue(event.target.value)}
                disabled={isSettingProfile}
                placeholder="continue"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </form>
          </div>
        </div>
      </ProfileSectionModal>
    </section>
  );
};

export default AttachmentsTab;
