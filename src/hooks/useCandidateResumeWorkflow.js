import {
  useParseCandidateResumeMutation,
  useSetResumeAsProfileMutation,
  useUploadCandidateResumeMutation,
  useUploadFilesMutation,
} from "@/apis/resumeApi";

const extractUploadedFile = (uploadedFiles) =>
  Array.isArray(uploadedFiles) ? uploadedFiles[0] ?? null : null;

export const buildResumeUploadPayload = (selectedFile, uploadedFile) => ({
  resumeName: selectedFile?.name ?? "Resume",
  fileName: uploadedFile?.originalFileName || selectedFile?.name || "resume",
  resumeUrl: uploadedFile?.downloadUrl,
});

const useCandidateResumeWorkflow = () => {
  const [uploadFiles, uploadFilesState] = useUploadFilesMutation();
  const [uploadCandidateResume, uploadCandidateResumeState] = useUploadCandidateResumeMutation();
  const [parseCandidateResume, parseCandidateResumeState] = useParseCandidateResumeMutation();
  const [setResumeAsProfile, setResumeAsProfileState] = useSetResumeAsProfileMutation();

  const uploadResumeAsset = async (selectedFile) => {
    const formData = new FormData();
    formData.append("files", selectedFile);

    const uploadResponses = await uploadFiles(formData).unwrap();
    const uploadedFile = extractUploadedFile(uploadResponses);

    if (!uploadedFile?.downloadUrl) {
      throw new Error("Upload file failed");
    }

    return {
      uploadedFile,
      payload: buildResumeUploadPayload(selectedFile, uploadedFile),
    };
  };

  const createUploadedResume = async (payload) => uploadCandidateResume(payload).unwrap();

  const startResumeParsing = async (resumeId) =>
    parseCandidateResume({ resumeId }).unwrap();

  const assignResumeAsProfile = async (resumeId) =>
    setResumeAsProfile({ resumeId }).unwrap();

  return {
    uploadResumeAsset,
    createUploadedResume,
    startResumeParsing,
    assignResumeAsProfile,
    isUploadingAsset: uploadFilesState.isLoading,
    isCreatingResume: uploadCandidateResumeState.isLoading,
    isParsingResume: parseCandidateResumeState.isLoading,
    isSettingResumeAsProfile: setResumeAsProfileState.isLoading,
  };
};

export default useCandidateResumeWorkflow;
