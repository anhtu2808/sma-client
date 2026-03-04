import React, { useMemo, useState } from "react";
import { message } from "antd";
import Switch from "@/components/Switch";
import { useCandidateDashboardProfileQuery, useUpdateCandidateDashboardProfileMutation } from "@/apis/candidateApi";
import { useGetCandidateResumesQuery, useSetResumeAsDefaultMutation } from "@/apis/resumeApi";
import { RESUME_TYPES } from "@/constant";
import ProfileSettingModal from "./profile-setting-modal";

const CvVisibilityControl = () => {
  const { data: profile } = useCandidateDashboardProfileQuery();
  const { data: profileResumes = [], isFetching: isFetchingProfileResumes } = useGetCandidateResumesQuery({
    type: RESUME_TYPES.PROFILE,
  });
  const { data: originalResumes = [], isFetching: isFetchingOriginalResumes } = useGetCandidateResumesQuery({
    type: RESUME_TYPES.ORIGINAL,
  });

  const [updateCandidateDashboardProfile, { isLoading: isUpdatingProfile }] = useUpdateCandidateDashboardProfileMutation();
  const [setResumeAsDefault, { isLoading: isSettingDefaultResume }] = useSetResumeAsDefaultMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState(null);

  const profileResume = profileResumes?.[0] || null;
  const isLoadingResumes = isFetchingProfileResumes || isFetchingOriginalResumes;
  const isSavingSelection = isSettingDefaultResume || isUpdatingProfile;

  const selectableResumes = useMemo(() => {
    const merged = [];
    if (profileResume) merged.push(profileResume);
    if (Array.isArray(originalResumes)) {
      merged.push(...originalResumes);
    }
    return merged;
  }, [originalResumes, profileResume]);

  const defaultResume = useMemo(() => {
    const explicitDefault = selectableResumes.find((resume) => Boolean(resume?.isDefault));
    if (explicitDefault) return explicitDefault;

    if (profile?.showAs === "PROFILE" && profileResume) {
      return profileResume;
    }

    return profileResume || originalResumes?.[0] || null;
  }, [originalResumes, profile?.showAs, profileResume, selectableResumes]);

  const selectedResume = useMemo(
    () => selectableResumes.find((resume) => resume?.id === selectedResumeId) || null,
    [selectableResumes, selectedResumeId]
  );

  const handleToggleVisibility = async (event) => {
    const nextValue = event.target.checked;
    try {
      await updateCandidateDashboardProfile({ isProfilePublic: nextValue }).unwrap();
      message.success(nextValue ? "Profile search visibility enabled." : "Profile search visibility disabled.");
    } catch (error) {
      message.error(error?.data?.message || "Failed to update profile visibility.");
    }
  };

  const openProfileSetting = () => {
    if (!selectableResumes.length) return;
    setSelectedResumeId(defaultResume?.id ?? selectableResumes[0]?.id ?? null);
    setIsModalOpen(true);
  };

  const closeProfileSetting = () => {
    if (isSavingSelection) return;
    setIsModalOpen(false);
  };

  const handleSaveProfileSetting = async () => {
    if (!selectedResume?.id) {
      message.warning("Please select a resume before saving.");
      return;
    }

    try {
      await setResumeAsDefault({ resumeId: selectedResume.id }).unwrap();
      const showAs = selectedResume.type === RESUME_TYPES.PROFILE ? "PROFILE" : "RESUME";
      await updateCandidateDashboardProfile({ showAs }).unwrap();
      message.success("Visible resume settings updated successfully.");
      setIsModalOpen(false);
    } catch (error) {
      message.error(error?.data?.message || "Failed to update visible resume settings.");
    }
  };

  return (
    <>
      <div className="mx-3 mt-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 dark:border-gray-700 dark:bg-gray-800/70">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-base font-semibold text-gray-900 dark:text-white">Allow profile search</p>
            <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">SmartRecruit Profile</p>
          </div>
          <Switch
            id="candidate-profile-visibility-switch"
            checked={profile?.isProfilePublic ?? true}
            onChange={handleToggleVisibility}
            disabled={isUpdatingProfile}
          />
        </div>

        <button
          type="button"
          className="mt-2 text-sm font-medium text-blue-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
          onClick={openProfileSetting}
          disabled={isLoadingResumes || isSavingSelection || selectableResumes.length === 0}
        >
          Profile settings
        </button>
      </div>

      <ProfileSettingModal
        open={isModalOpen}
        profileResume={profileResume}
        originalResumes={originalResumes}
        selectedResumeId={selectedResumeId}
        onSelectResume={(resume) => setSelectedResumeId(resume?.id ?? null)}
        onCancel={closeProfileSetting}
        onSubmit={handleSaveProfileSetting}
        loading={isSavingSelection}
      />
    </>
  );
};

export default CvVisibilityControl;
