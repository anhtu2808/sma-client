import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileSectionModal from "@/components/ProfileSectionModal";

const getResumeDisplayName = (resume) => resume?.fileName || resume?.resumeName || `Resume #${resume?.id}`;
const getResumeUploadedAt = (resume) => {
  const timestamp = resume?.resumeUrl?.split("/").pop()?.split("_")[0];
  if (timestamp && !Number.isNaN(Number(timestamp))) {
    return new Date(Number.parseInt(timestamp, 10)).toLocaleString();
  }
  return "Unknown";
};

const ResumeOption = ({ resume, checked, onChange, disabled }) => (
  <label
    className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
      checked ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/40"
    } ${disabled ? "pointer-events-none opacity-60" : ""}`}
  >
    <input
      type="radio"
      name="default-resume-option"
      checked={checked}
      onChange={() => onChange(resume)}
      disabled={disabled}
      className="mt-1 h-5 w-5 appearance-none rounded-full border-2 border-primary bg-white checked:border-[6px] checked:border-primary"
    />
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-gray-900">{getResumeDisplayName(resume)}</p>
      <p className="mt-1 text-xs text-gray-500">Uploaded: {getResumeUploadedAt(resume)}</p>
    </div>
  </label>
);

const ProfileResumeOption = ({ resume, checked, onChange, disabled, onEdit, completeness = 0 }) => {
  const isReady = completeness >= 60;
  return (
    <label
      className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 transition-colors ${
        checked ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/40"
      } ${disabled ? "pointer-events-none opacity-60" : ""}`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <input
          type="radio"
          name="default-resume-option"
          checked={checked}
          onChange={() => onChange(resume)}
          disabled={disabled}
          className="mt-1 h-5 w-5 shrink-0 appearance-none rounded-full border-2 border-primary bg-white checked:border-[6px] checked:border-primary"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">SmartRecruit Profile</p>
          <p className="mt-0.5 text-xs text-gray-500">{completeness}% completed</p>
          {isReady ? (
            <span className="mt-1 inline-block rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
              Ready
            </span>
          ) : (
            <span className="mt-1 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
              Incomplete — fill more to activate
            </span>
          )}
        </div>
      </div>
      <button
        type="button"
        className="inline-flex h-9 shrink-0 items-center rounded-lg border border-primary/70 px-4 text-sm font-semibold text-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onEdit?.();
        }}
        disabled={disabled}
      >
        Edit
      </button>
    </label>
  );
};

const ProfileSettingModal = ({
  open,
  profileResume,
  profileCompleteness = 0,
  originalResumes,
  selectedResumeId,
  onSelectResume,
  onCancel,
  onSubmit,
  loading,
}) => {
  const navigate = useNavigate();
  const canSubmit = Boolean(selectedResumeId);

  return (
    <ProfileSectionModal
      open={open}
      title="Profile settings"
      onCancel={onCancel}
      loading={loading}
      loadingText="Saving..."
      submitText="Save"
      submitDisabled={!canSubmit}
      cancelText="Cancel"
      width={760}
      formId="profile-setting-resume-form"
    >
      <form
        id="profile-setting-resume-form"
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (canSubmit && !loading) {
            void onSubmit();
          }
        }}
      >
        <section>
          <h4 className="text-lg font-semibold text-gray-900">SmartRecruit Profile</h4>
          <p className="mt-1 text-sm text-gray-500">Select a PROFILE resume as the default searchable profile.</p>
          <div className="mt-3">
            {profileResume ? (
              <ProfileResumeOption
                resume={profileResume}
                checked={selectedResumeId === profileResume.id}
                onChange={onSelectResume}
                disabled={loading}
                completeness={profileCompleteness}
                onEdit={() => {
                  onCancel?.();
                  navigate("/dashboard/profile");
                }}
              />
            ) : (
              <p className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                No PROFILE resume found.
              </p>
            )}
          </div>
        </section>

        <section>
          <h4 className="text-lg font-semibold text-gray-900">Attached resumes</h4>
          <p className="mt-1 text-sm text-gray-500">Select an ORIGINAL resume to display to recruiters.</p>
          {originalResumes?.length ? (
            <div className="mt-3 space-y-3">
              {originalResumes.map((resume) => (
                <ResumeOption
                  key={resume.id}
                  resume={resume}
                  checked={selectedResumeId === resume.id}
                  onChange={onSelectResume}
                  disabled={loading}
                />
              ))}
            </div>
          ) : (
            <p className="mt-3 rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
              No ORIGINAL resume found.
            </p>
          )}
        </section>
      </form>
    </ProfileSectionModal>
  );
};

export default ProfileSettingModal;
