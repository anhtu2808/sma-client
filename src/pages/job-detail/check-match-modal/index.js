import React, { useEffect, useMemo, useRef, useState } from "react";
import { message, Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetCandidateResumesQuery,
  useParseCandidateResumeMutation,
  useUploadCandidateResumeMutation,
  useUploadFilesMutation,
} from "@/apis/resumeApi";
import Loading from "@/components/Loading";
import { RESUME_TYPES } from "@/constant";
import { getErrorMessage, normalizeParseStatus } from "@/constant/attachment";
import ResumeOption from "./resume-option";

const isSupportedResumeFile = (fileName = "") => /\.(pdf|doc|docx)$/i.test(`${fileName}`.trim());

const mergeAndSortResumes = (profileResumes = [], originalResumes = []) => {
  const mergedMap = new Map();

  [...profileResumes, ...originalResumes].forEach((resume) => {
    if (!resume?.id) return;
    const existing = mergedMap.get(resume.id);
    if (!existing || resume.type === "PROFILE") {
      mergedMap.set(resume.id, resume);
    }
  });

  return [...mergedMap.values()]
    .map((resume) => ({
      ...resume,
      parseStatus: normalizeParseStatus(resume.parseStatus || "WAITING"),
    }))
    .sort((left, right) => {
      const leftParsed = left.parseStatus === "FINISH";
      const rightParsed = right.parseStatus === "FINISH";
      if (leftParsed !== rightParsed) return leftParsed ? -1 : 1;

      if (left.type === "PROFILE" && right.type !== "PROFILE") return -1;
      if (left.type !== "PROFILE" && right.type === "PROFILE") return 1;
      return Number(right.id || 0) - Number(left.id || 0);
    });
};

const CheckMatchModal = ({ open, onClose, jobId, jobName }) => {
  const { id: routeJobId } = useParams();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const effectiveJobId = jobId || routeJobId;

  const [selectedResumeId, setSelectedResumeId] = useState(null);

  const {
    data: profileResumes = [],
    isLoading: isProfileLoading,
    isFetching: isProfileFetching,
  } = useGetCandidateResumesQuery(
    { type: RESUME_TYPES.PROFILE },
    { skip: !open }
  );

  const {
    data: originalResumes = [],
    isLoading: isOriginalLoading,
    isFetching: isOriginalFetching,
  } = useGetCandidateResumesQuery(
    { type: RESUME_TYPES.ORIGINAL },
    { skip: !open }
  );

  const [uploadFiles, { isLoading: isUploadingFile }] = useUploadFilesMutation();
  const [uploadCandidateResume, { isLoading: isSavingResume }] = useUploadCandidateResumeMutation();
  const [parseCandidateResume, { isLoading: isParsingResume }] = useParseCandidateResumeMutation();

  const isLoadingResumes = isProfileLoading || isOriginalLoading || isProfileFetching || isOriginalFetching;

  const resumes = useMemo(
    () => mergeAndSortResumes(profileResumes, originalResumes),
    [profileResumes, originalResumes]
  );

  useEffect(() => {
    if (!open) {
      setSelectedResumeId(null);
      return;
    }

    const selectableResumes = resumes.filter((resume) => resume.parseStatus === "FINISH");

    if (selectableResumes.length > 0 && (!selectedResumeId || !selectableResumes.some((r) => r.id === selectedResumeId))) {
      setSelectedResumeId(selectableResumes[0].id);
    }
  }, [open, resumes]);

  const handleClose = () => {
    setSelectedResumeId(null);
    onClose();
  };

  const handleUploadResume = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isSupportedResumeFile(file.name)) {
      message.error("Only PDF, DOC, and DOCX files are supported.");
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

      setSelectedResumeId(createdResume?.id ?? null);
      message.success("Resume uploaded successfully.");
    } catch (error) {
      message.error(getErrorMessage(error, "Upload resume failed"));
    } finally {
      event.target.value = "";
    }
  };

  const selectedResume = resumes.find((resume) => resume.id === selectedResumeId) || null;
  const canSubmit = selectedResume?.parseStatus === "FINISH";
  const isUploading = isUploadingFile || isSavingResume;

  const handleParseResume = async (resumeId) => {
    if (!resumeId) return;
    try {
      await parseCandidateResume({ resumeId }).unwrap();
      message.success("Resume parsing started. Please wait a moment.");
    } catch (error) {
      message.error(getErrorMessage(error, "Failed to start resume parsing."));
    }
  };

  const handleCheckMatch = () => {
    if (!canSubmit || !selectedResume || !effectiveJobId) {
      message.warning("Please select a parsed resume to continue.");
      return;
    }

    handleClose();
    navigate(`/jobs/${effectiveJobId}/matching-score?resumeId=${selectedResume.id}`);
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
          <span className="material-icons-round text-primary">auto_awesome</span>
          Select Resume to Match
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Choose a resume to analyze against <span className="font-semibold text-gray-900">{jobName || "this job"}</span>.
        </p>
      </div>

      <div className="max-h-[62vh] overflow-y-auto pt-6">
        {isLoadingResumes ? (
          <Loading size={80} className="py-8" />
        ) : resumes.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-sm font-medium text-gray-700">No resume found.</p>
            <p className="mt-1 text-xs text-gray-500">Upload a new resume to start AI matching.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map((resume) => {
              const isSelectable = resume.parseStatus === "FINISH";
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
                />
              );
            })}
          </div>
        )}

        <div className="mt-4">
          <label className="group flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 py-4 text-gray-500 transition-all hover:border-primary hover:bg-gray-50 hover:text-primary">
            <span className="material-icons-round mb-1 transition-transform group-hover:scale-110">cloud_upload</span>
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
          disabled={!canSubmit}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="material-icons-round text-[18px]">auto_awesome</span>
          Check Match with AI
        </button>
      </div>
    </Modal>
  );
};

export default CheckMatchModal;
