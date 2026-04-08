import React, { useEffect, useRef, useState } from "react";
import { Modal } from "antd";
import toastMessage from "@/utils/toastMessage";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetCandidateResumesQuery,
  useParseCandidateResumeMutation,
  useUploadCandidateResumeMutation,
  useUploadFilesMutation,
  useDeleteCandidateResumeMutation,
} from "@/apis/resumeApi";
import { useStartMatchingDetailMutation } from "@/apis/matchingApi";
import Loading from "@/components/Loading";
import { RESUME_TYPES } from "@/constant";
import { getErrorMessage } from "@/constant/attachment";
import { getEvaluationHistoryId, getResumeMatchMode } from "./matchHistory";
import ResumeOption from "./resume-option";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp, faWandMagicSparkles } from '../../../utils/icons';

const isSupportedResumeFile = (fileName = "") => /\.(pdf|doc|docx)$/i.test(`${fileName}`.trim());

const CheckMatchModal = ({ open, onClose, jobId, jobName }) => {
  const { id: routeJobId } = useParams();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const effectiveJobId = jobId || routeJobId;
  const normalizedJobId = Number.parseInt(`${effectiveJobId ?? ""}`, 10);
  const hasValidJobId = Number.isFinite(normalizedJobId);

  const [selectedResumeId, setSelectedResumeId] = useState(null);

  const {
    data: resumes = [],
    isLoading: isLoadingResumes,
    isFetching: isFetchingResumes,
  } = useGetCandidateResumesQuery(
    { type: RESUME_TYPES.ORIGINAL, jobId: hasValidJobId ? normalizedJobId : undefined },
    { skip: !open }
  );

  const [uploadFiles, { isLoading: isUploadingFile }] = useUploadFilesMutation();
  const [uploadCandidateResume, { isLoading: isSavingResume }] = useUploadCandidateResumeMutation();
  const [parseCandidateResume, { isLoading: isParsingResume }] = useParseCandidateResumeMutation();
  const [startMatchingDetail, { isLoading: isStartingMatching }] = useStartMatchingDetailMutation();
  const [deleteCandidateResume] = useDeleteCandidateResumeMutation();

  const isResumesLoading = isLoadingResumes || isFetchingResumes;

  useEffect(() => {
    if (!open) {
      setSelectedResumeId(null);
      return;
    }

    const selectableResumes = resumes.filter((resume) => {
      const mode = getResumeMatchMode(resume);
      return mode === "new" || mode === "retry";
    });

    if (selectableResumes.length > 0 && (!selectedResumeId || !selectableResumes.some((r) => r.id === selectedResumeId))) {
      setSelectedResumeId(selectableResumes[0].id);
      return;
    }

    if (selectableResumes.length === 0 && selectedResumeId != null) {
      setSelectedResumeId(null);
    }
  }, [open, resumes, selectedResumeId]);

  const handleClose = () => {
    setSelectedResumeId(null);
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
      const uploadedFile = Array.isArray(uploadedFiles) ? uploadedFiles[0] : null;

      if (!uploadedFile?.downloadUrl) {
        throw new Error("Upload file failed");
      }

      const createdResume = await uploadCandidateResume({
        resumeName: file.name,
        fileName: uploadedFile.originalFileName || file.name,
        resumeUrl: uploadedFile.downloadUrl,
      }).unwrap();

      if (createdResume?.id) {
        parseCandidateResume({ resumeId: createdResume.id });
      }
      setSelectedResumeId(createdResume?.id ?? null);
      toastMessage.success("Resume uploaded successfully. Parsing started automatically.");
    } catch (error) {
      toastMessage.error(getErrorMessage(error, "Upload resume failed"));
    } finally {
      event.target.value = "";
    }
  };

  const selectedResume = resumes.find((resume) => resume.id === selectedResumeId) || null;
  const selectedResumeMatchMode = getResumeMatchMode(selectedResume);
  const canSubmit = !!selectedResume && (selectedResumeMatchMode === "new" || selectedResumeMatchMode === "retry");
  const selectedEvaluationId = getEvaluationHistoryId(selectedResume);
  const isUploading = isUploadingFile || isSavingResume;

  const handleViewHistory = (resume) => {
    const evaluationId = getEvaluationHistoryId(resume);
    if (!evaluationId) return;

    handleClose();
    navigate(`/match-report/${evaluationId}`, {
      state: {
        jobId: normalizedJobId,
        resumeId: resume.id,
        matchSource: "existing",
      },
    });
  };

  const handleParseResume = async (resumeId) => {
    if (!resumeId) return;
    try {
      await parseCandidateResume({ resumeId }).unwrap();
      toastMessage.success("Resume parsing started. Please wait a moment.");
    } catch (error) {
      toastMessage.error(getErrorMessage(error, "Failed to start resume parsing."));
    }
  };

  const handleDeleteResume = (resumeId) => {
    Modal.confirm({
      title: "Delete Resume",
      content: "Are you sure you want to permanently delete this resume?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteCandidateResume({ resumeId }).unwrap();
          if (selectedResumeId === resumeId) {
            setSelectedResumeId(null);
          }
          toastMessage.success("Resume deleted successfully.");
        } catch (error) {
          toastMessage.error(getErrorMessage(error, "Failed to delete resume."));
        }
      },
    });
  };

  const handleCheckMatch = async () => {
    if (!canSubmit || !selectedResume || !effectiveJobId) {
      toastMessage.warning("Please select a resume to continue.");
      return;
    }

    if (selectedResumeMatchMode === "existing" && selectedEvaluationId != null) {
      handleClose();
      navigate(`/match-report/${selectedEvaluationId}`, {
        state: {
          jobId: normalizedJobId,
          resumeId: selectedResume.id,
          matchSource: "existing",
        },
      });
      return;
    }

    try {
      const evaluationId = await startMatchingDetail({
        jobId: normalizedJobId,
        resumeId: selectedResume.id,
      }).unwrap();

      if (!Number.isFinite(Number(evaluationId))) {
        throw new Error("Invalid matching evaluation id");
      }

      handleClose();
      navigate(`/match-report/${Number(evaluationId)}`, {
        state: {
          jobId: normalizedJobId,
          resumeId: selectedResume.id,
          matchSource: "new",
        },
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
          <FontAwesomeIcon icon={faWandMagicSparkles} className="text-primary" />
          Select Resume to Match
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Choose a resume to analyze against <span className="font-semibold text-gray-900">{jobName || "this job"}</span>.
        </p>
      </div>

      <div className="-mr-3 max-h-[62vh] overflow-y-auto pr-3 pt-6">
        {isResumesLoading ? (
          <Loading size={80} className="py-8" />
        ) : resumes.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-sm font-medium text-gray-700">No resume found.</p>
            <p className="mt-1 text-xs text-gray-500">Upload a new resume to start AI matching.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map((resume) => {
              const isSelectable = getResumeMatchMode(resume) === "new";
              const isPartial = resume.parseStatus === "PARTIAL";
              return (
                <ResumeOption
                  key={resume.id}
                  resume={resume}
                  isSelected={selectedResumeId === resume.id}
                  isSelectable={isSelectable}
                  isPartial={isPartial}
                  isParsing={isParsingResume}
                  onSelect={setSelectedResumeId}
                  onParse={handleParseResume}
                  onViewHistory={handleViewHistory}
                  onDelete={handleDeleteResume}
                />
              );
            })}
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

export default CheckMatchModal;
