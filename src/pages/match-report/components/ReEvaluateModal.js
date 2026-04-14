import React, { useState, useRef, useEffect, useMemo } from "react";
import { Modal } from "antd";
import toastMessage from "@/utils/toastMessage";
import {
  useGetCandidateResumesQuery,
  useUploadFilesMutation,
  useUploadCandidateResumeMutation,
  useDeleteCandidateResumeMutation,
} from "@/apis/resumeApi";
import { useStartMatchingDetailMutation } from "@/apis/matchingApi";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Loading from "@/components/Loading";
import { getErrorMessage, normalizeParseStatus } from "@/constant/attachment";
import { RESUME_TYPES } from "@/constant";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp, faFileArrowUp, faTrashCan, faWandMagicSparkles } from '../../../utils/icons';

dayjs.extend(relativeTime);

const isSupportedResumeFile = (fileName = "") =>
  /\.(pdf|doc|docx)$/i.test(`${fileName}`.trim());

const ResumeOption = ({ resume, isSelected, isCurrent, currentScore, onSelect, onDelete }) => {
  const status = normalizeParseStatus(resume?.parseStatus);
  const isParsed = status === "FINISH";

  const cardClassName = isCurrent
    ? "border-2 border-amber-400 bg-amber-50/50"
    : isSelected
    ? "border-2 border-primary bg-orange-50/40"
    : "border border-gray-200 bg-white hover:border-primary";

  return (
    <div
      className={`rounded-xl p-5 transition-all ${isCurrent ? "" : "cursor-pointer"} ${cardClassName}`}
      role={isCurrent ? undefined : "button"}
      tabIndex={isCurrent ? -1 : 0}
      onClick={() => !isCurrent && onSelect(resume.id)}
      onKeyDown={(event) => {
        if (isCurrent) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(resume.id);
        }
      }}
    >
      <div className="flex h-full items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-semibold text-gray-900 truncate">
              {resume.resumeName || resume.fileName || `Resume #${resume.id}`}
            </h4>
            {isCurrent && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                Current resume
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-medium ${
                isParsed
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-amber-200 bg-amber-50 text-amber-700"
              }`}
            >
              {isParsed ? "Parsed" : "Parsing"}
            </span>
            <span className="text-gray-400">•</span>
            <span>
              {resume.createdAt
                ? dayjs(resume.createdAt).fromNow()
                : "Recently uploaded"}
            </span>
          </div>

          {isCurrent && currentScore != null && (
            <div className="mt-3">
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                Current score: {currentScore}%
              </span>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isCurrent ? (
            <span className="text-xs font-medium text-amber-600">Currently viewing</span>
          ) : (
            <>
              {onDelete && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(resume.id);
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  aria-label="Delete resume"
                >
                  <FontAwesomeIcon icon={faTrashCan} className="text-[18px]" />
                </button>
              )}
              <input
                type="radio"
                checked={isSelected}
                onChange={() => onSelect(resume.id)}
                className="h-5 w-5 cursor-pointer border-gray-300 focus:ring-primary"
                style={{ accentColor: "#ff5722" }}
                aria-label={`Select resume ${resume.originalName || resume.name || resume.id}`}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ReEvaluateModal = ({ open, onClose, jobId, currentResumeId, currentScore }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [uploadedResume, setUploadedResume] = useState(null);

  const { data: resumes = [], isLoading: isLoadingResumes } =
    useGetCandidateResumesQuery(
      { type: RESUME_TYPES.ORIGINAL, jobId },
      { skip: !open || !jobId }
    );

  const [uploadFiles, { isLoading: isUploadingFile }] =
    useUploadFilesMutation();
  const [uploadCandidateResume, { isLoading: isSavingResume }] =
    useUploadCandidateResumeMutation();
  const [startMatchingDetail, { isLoading: isStartingMatching }] =
    useStartMatchingDetailMutation();
  const [deleteCandidateResume] = useDeleteCandidateResumeMutation();


  useEffect(() => {
    if (!open) {
      setSelectedResumeId(null);
      setUploadedResume(null);
      return;
    }

    // Auto-select first non-current resume if available and none selected
    if (resumes.length > 0 && !selectedResumeId && !uploadedResume) {
      const firstSelectable = resumes.find((r) => r.id !== currentResumeId);
      if (firstSelectable) {
        setSelectedResumeId(firstSelectable.id);
      }
    }
  }, [open, resumes, selectedResumeId, uploadedResume, currentResumeId]);

  const handleClose = () => {
    setSelectedResumeId(null);
    setUploadedResume(null);
    onClose();
  };

  const handleUploadResume = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isSupportedResumeFile(file.name)) {
      toastMessage.error("Only PDF, DOC, and DOCX files are supported.");
      event.target.value = "";
      return;
    }

    try {
      const formData = new FormData();
      formData.append("files", file);

      const uploadedFiles = await uploadFiles(formData).unwrap();
      const uploadedFile = Array.isArray(uploadedFiles)
        ? uploadedFiles[0]
        : uploadedFiles;

      const fileUrl =
        uploadedFile?.downloadUrl ||
        uploadedFile?.url ||
        uploadedFile?.data?.url;

      if (!fileUrl) {
        throw new Error("Upload file failed");
      }

      const createdResume = await uploadCandidateResume({
        fileUrl,
        originalName: file.name,
        type: "ORIGINAL",
      }).unwrap();

      const newResume = {
        id: createdResume?.id ?? createdResume?.data?.id,
        resumeName: file.name,
        fileName: file.name,
        type: "ORIGINAL",
        parseStatus: "FINISH",
        createdAt: createdResume?.createdAt || new Date().toISOString(),
      };

      setUploadedResume(newResume);
      setSelectedResumeId(newResume.id);
      toastMessage.success("Resume uploaded successfully.");
    } catch (error) {
      toastMessage.error(getErrorMessage(error, "Upload resume failed"));
    } finally {
      event.target.value = "";
    }
  };

  const effectiveResumes = useMemo(() => {
    if (uploadedResume) {
      return [uploadedResume, ...resumes.filter((r) => r.id !== uploadedResume.id)];
    }
    return resumes;
  }, [resumes, uploadedResume]);

  const selectedResume = effectiveResumes.find(
    (resume) => resume.id === selectedResumeId
  );
  const canSubmit = !!selectedResume && !!jobId && selectedResumeId !== currentResumeId;
  const isUploading = isUploadingFile || isSavingResume;

  const handleDeleteResume = (resumeId) => {
    Modal.confirm({
      title: "Delete Resume",
      content: "Are you sure you want to permanently delete this resume?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          await deleteCandidateResume({ resumeId }).unwrap();
          if (selectedResumeId === resumeId) {
            setSelectedResumeId(null);
          }
          if (uploadedResume?.id === resumeId) {
            setUploadedResume(null);
          }
          toastMessage.success("Resume deleted successfully.");
        } catch (error) {
          toastMessage.error(getErrorMessage(error, "Failed to delete resume."));
        }
      },
    });
  };

  const handleCheckMatch = async () => {
    if (!canSubmit || !selectedResume || !jobId) {
      toastMessage.warning("Please select a resume to continue.");
      return;
    }

    try {
      const evaluationId = await startMatchingDetail({
        jobId: Number(jobId),
        resumeId: selectedResume.id,
      }).unwrap();

      if (!Number.isFinite(Number(evaluationId))) {
        throw new Error("Invalid matching evaluation id");
      }

      handleClose();
      navigate(`/match-report/${Number(evaluationId)}`, {
        state: {
          jobId: Number(jobId),
          resumeId: selectedResume.id,
          matchSource: "new",
        },
        replace: true,
      });
    } catch (error) {
      toastMessage.error(getErrorMessage(error, "Unable to start AI matching."));
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      destroyOnHidden
      width={860}
    >
      <div className="-mx-6 -mt-2 rounded-t-xl border-b border-gray-100 bg-gray-50/80 px-6 pb-5">
        <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <FontAwesomeIcon icon={faFileArrowUp} className="text-primary" />
          Re-evaluate with New Resume
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Upload a new resume or select from your library to get a fresh AI
          matching score.
        </p>
      </div>

      <div className="-mr-3 max-h-[62vh] overflow-y-auto pr-3 pt-6">
        {isLoadingResumes ? (
          <Loading size={80} className="py-8" />
        ) : effectiveResumes.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-sm font-medium text-gray-700">No resume found.</p>
            <p className="mt-1 text-xs text-gray-500">
              Upload a new resume to start AI matching.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {effectiveResumes.map((resume) => (
              <ResumeOption
                key={resume.id}
                resume={resume}
                isSelected={selectedResumeId === resume.id}
                isCurrent={resume.id === currentResumeId}
                currentScore={currentScore}
                onSelect={setSelectedResumeId}
                onDelete={resume.id !== currentResumeId ? handleDeleteResume : undefined}
              />
            ))}
          </div>
        )}

        <div className="mt-4">
          <label className="group flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 py-4 text-gray-500 transition-all hover:border-primary hover:bg-gray-50 hover:text-primary">
            <FontAwesomeIcon icon={faCloudArrowUp} className="mb-1 transition-transform group-hover:scale-110" />
            <span className="text-sm font-semibold">
              {isUploading ? "Uploading..." : "Upload a new resume"}
            </span>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={handleUploadResume}
              accept=".pdf,.doc,.docx"
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      <div className="-mx-6 mt-6 flex justify-end gap-3 border-t border-gray-100 bg-gray-50/80 px-6 pt-4">
        <button
          type="button"
          onClick={handleClose}
          className="h-11 rounded-lg px-5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCheckMatch}
          disabled={!canSubmit || isStartingMatching}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faWandMagicSparkles} className="text-[18px]" />
          {isStartingMatching ? "Starting..." : "Check Match with AI"}
        </button>
      </div>
    </Modal>
  );
};

export default ReEvaluateModal;
