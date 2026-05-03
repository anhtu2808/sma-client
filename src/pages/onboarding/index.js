import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "antd";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import Input from "@/components/Input";
import { useCandidateDashboardProfileQuery, useCandidateProfileQuery, useUpdateCandidateDashboardProfileMutation } from "@/apis/candidateApi";
import { useGetCandidateResumesQuery, useLazyGetResumeParseStatusQuery } from "@/apis/resumeApi";
import { RESUME_TYPES } from "@/constant";
import SideDecorator from "@/pages/login/side-decorator";
import toastMessage from "@/utils/toastMessage";
import authService from "@/services/authService";
import useCandidateResumeWorkflow from "@/hooks/useCandidateResumeWorkflow";
import { clearCandidateOnboardingPending } from "@/utils/candidateOnboardingStorage";
import {
  getErrorMessage,
  getParseStatusView,
  normalizeParseStatus,
  POLL_INTERVAL_MS,
  POLL_TIMEOUT_MS,
  TERMINAL_PARSE_STATUSES,
} from "@/constant/attachment";

const INITIAL_PROFILE_FORM = {
  fullName: "",
  phone: "",
  jobTitle: "",
  address: "",
  githubUrl: "",
  linkedinUrl: "",
  websiteUrl: "",
};

const normalizeText = (value) => {
  const normalized = `${value ?? ""}`.trim().replace(/\s+/g, " ");
  return normalized || null;
};

const normalizeUrl = (value) => normalizeText(value);

const buildProfilePayload = (form) => ({
  fullName: normalizeText(form.fullName),
  phone: normalizeText(form.phone),
  jobTitle: normalizeText(form.jobTitle),
  address: normalizeText(form.address),
  githubUrl: normalizeUrl(form.githubUrl),
  linkedinUrl: normalizeUrl(form.linkedinUrl),
  websiteUrl: normalizeUrl(form.websiteUrl),
});

const Onboarding = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const pollingTimersRef = useRef({});
  const pollingStartTimesRef = useRef({});
  const hasHydratedProfileRef = useRef(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [profileForm, setProfileForm] = useState(INITIAL_PROFILE_FORM);
  const [profileErrors, setProfileErrors] = useState({});
  const [activeParsingResumeId, setActiveParsingResumeId] = useState(null);
  const [settingProfileId, setSettingProfileId] = useState(null);
  const [parseStatusOverrides, setParseStatusOverrides] = useState({});
  const [pollingByResumeId, setPollingByResumeId] = useState({});

  const {
    data: myInfoResponse,
    isLoading: isLoadingMyInfo,
    isFetching: isFetchingMyInfo,
    isError: isMyInfoError,
  } = useCandidateProfileQuery(undefined, {
    skip: !authService.isAuthenticated(),
  });
  const {
    data: profile,
    isLoading: isLoadingProfile,
    isFetching: isFetchingProfile,
    isError: isProfileError,
  } = useCandidateDashboardProfileQuery(undefined, {
    skip: !authService.isAuthenticated(),
  });
  const {
    data: resumes = [],
    isLoading: isLoadingResumes,
    isFetching: isFetchingResumes,
  } = useGetCandidateResumesQuery(
    { type: RESUME_TYPES.ORIGINAL },
    { skip: !authService.isAuthenticated() }
  );
  const [updateCandidateDashboardProfile, { isLoading: isSavingProfile }] =
    useUpdateCandidateDashboardProfileMutation();
  const [triggerResumeParseStatus] = useLazyGetResumeParseStatusQuery();
  const {
    uploadResumeAsset,
    createUploadedResume,
    startResumeParsing,
    assignResumeAsProfile,
    isUploadingAsset,
    isCreatingResume,
    isSettingResumeAsProfile,
  } = useCandidateResumeWorkflow();

  const currentUser = myInfoResponse?.data?.user ?? null;

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!profile || hasHydratedProfileRef.current) {
      return;
    }

    hasHydratedProfileRef.current = true;
    setProfileForm({
      fullName: profile.fullName ?? "",
      phone: profile.phone ?? "",
      jobTitle: profile.jobTitle ?? "",
      address: profile.address ?? "",
      githubUrl: profile.githubUrl ?? "",
      linkedinUrl: profile.linkedinUrl ?? "",
      websiteUrl: profile.websiteUrl ?? "",
    });
  }, [profile]);

  const hasBasicProfile = useMemo(
    () => Boolean(normalizeText(profile?.fullName) && normalizeText(profile?.jobTitle)),
    [profile?.fullName, profile?.jobTitle]
  );

  useEffect(() => {
    if (hasBasicProfile) {
      setCurrentStep((previousStep) => (previousStep === 1 ? 2 : previousStep));
    }
  }, [hasBasicProfile]);

  const isProfileResumeReady =
    Boolean(profile?.profileResumeId) &&
    normalizeParseStatus(profile?.resumeParseStatus) === "FINISH";

  const canFinishOnboarding = Boolean(normalizeText(profile?.jobTitle)) && isProfileResumeReady;

  const stopPolling = useCallback((resumeId) => {
    if (pollingTimersRef.current[resumeId]) {
      clearInterval(pollingTimersRef.current[resumeId]);
      delete pollingTimersRef.current[resumeId];
    }

    delete pollingStartTimesRef.current[resumeId];
    setPollingByResumeId((previousState) => {
      if (!previousState[resumeId]) return previousState;

      const nextState = { ...previousState };
      delete nextState[resumeId];
      return nextState;
    });
  }, []);

  useEffect(() => {
    return () => {
      Object.values(pollingTimersRef.current).forEach((timer) => clearInterval(timer));
      pollingTimersRef.current = {};
      pollingStartTimesRef.current = {};
    };
  }, []);

  useEffect(() => {
    setParseStatusOverrides((previousState) => {
      const previousEntries = Object.entries(previousState);
      if (previousEntries.length === 0) return previousState;

      const resumeIdSet = new Set(resumes.map((resume) => resume.id));
      let changed = false;
      const nextState = {};

      previousEntries.forEach(([resumeId, status]) => {
        if (resumeIdSet.has(Number.parseInt(resumeId, 10))) {
          nextState[resumeId] = status;
        } else {
          changed = true;
        }
      });

      return changed ? nextState : previousState;
    });
  }, [resumes]);

  const startPolling = useCallback(
    async (resumeId) => {
      if (!resumeId || pollingTimersRef.current[resumeId]) {
        return;
      }

      pollingStartTimesRef.current[resumeId] = Date.now();
      setPollingByResumeId((previousState) => ({ ...previousState, [resumeId]: true }));

      const pollStatus = async () => {
        const startedAt = pollingStartTimesRef.current[resumeId];
        if (!startedAt) {
          stopPolling(resumeId);
          return;
        }

        if (Date.now() - startedAt >= POLL_TIMEOUT_MS) {
          stopPolling(resumeId);
          toastMessage.info("Resume parsing is still processing. Please try again in a moment.");
          return;
        }

        try {
          const status = normalizeParseStatus(
            await triggerResumeParseStatus({ resumeId }).unwrap()
          );
          setParseStatusOverrides((previousState) => ({
            ...previousState,
            [resumeId]: status,
          }));

          if (TERMINAL_PARSE_STATUSES.has(status)) {
            stopPolling(resumeId);
          }
        } catch (error) {
          stopPolling(resumeId);
          toastMessage.error(getErrorMessage(error, "Unable to check parse status."));
        }
      };

      await pollStatus();
      pollingTimersRef.current[resumeId] = setInterval(() => {
        void pollStatus();
      }, POLL_INTERVAL_MS);
    },
    [stopPolling, triggerResumeParseStatus]
  );

  useEffect(() => {
    const resumeIdsToPoll = resumes
      .filter((resume) => {
        const status = parseStatusOverrides[resume.id] || resume.parseStatus;
        return normalizeParseStatus(status) === "PARTIAL" || Boolean(pollingByResumeId[resume.id]);
      })
      .map((resume) => resume.id);

    resumeIdsToPoll.forEach((resumeId) => {
      void startPolling(resumeId);
    });

    Object.keys(pollingTimersRef.current).forEach((resumeIdKey) => {
      const resumeId = Number.parseInt(resumeIdKey, 10);
      if (!resumeIdsToPoll.includes(resumeId)) {
        stopPolling(resumeId);
      }
    });
  }, [parseStatusOverrides, pollingByResumeId, resumes, startPolling, stopPolling]);

  const resumeItems = useMemo(
    () =>
      resumes.map((resume) => {
        const status = normalizeParseStatus(
          parseStatusOverrides[resume.id] || resume.parseStatus || "WAITING"
        );
        return {
          id: resume.id,
          name: resume.resumeName || resume.fileName || `Resume #${resume.id}`,
          fileName: resume.fileName || "",
          status,
          statusView: getParseStatusView(status, Boolean(pollingByResumeId[resume.id])),
        };
      }),
    [parseStatusOverrides, pollingByResumeId, resumes]
  );

  const validateProfileStep = () => {
    const nextErrors = {};

    if (!normalizeText(profileForm.fullName)) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!normalizeText(profileForm.jobTitle)) {
      nextErrors.jobTitle = "Job title is required.";
    }

    setProfileErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleProfileChange = (field) => (event) => {
    const value = event?.target?.value ?? "";
    setProfileForm((previousState) => ({
      ...previousState,
      [field]: value,
    }));

    if (profileErrors[field]) {
      setProfileErrors((previousState) => ({
        ...previousState,
        [field]: undefined,
      }));
    }
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    if (!validateProfileStep()) {
      return;
    }

    try {
      await updateCandidateDashboardProfile(buildProfilePayload(profileForm)).unwrap();
      toastMessage.success("Basic profile saved.");
      setCurrentStep(2);
    } catch (error) {
      toastMessage.error(error?.data?.message || "Failed to save profile.");
    }
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleUploadFile = async (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    try {
      const { payload } = await uploadResumeAsset(selectedFile);
      const createdResume = await createUploadedResume(payload);
      await startResumeParsing(createdResume.id);

      setParseStatusOverrides((previousState) => ({
        ...previousState,
        [createdResume.id]: "PARTIAL",
      }));
      await startPolling(createdResume.id);
      toastMessage.success("Upload completed. Resume parsing has started.");
    } catch (error) {
      toastMessage.error(getErrorMessage(error, "Upload resume failed."));
    } finally {
      event.target.value = "";
    }
  };

  const handleRetryParse = async (resumeId) => {
    try {
      setActiveParsingResumeId(resumeId);
      await startResumeParsing(resumeId);
      setParseStatusOverrides((previousState) => ({
        ...previousState,
        [resumeId]: "PARTIAL",
      }));
      await startPolling(resumeId);
      toastMessage.success("Resume parsing has started.");
    } catch (error) {
      toastMessage.error(getErrorMessage(error, "Failed to start resume parsing."));
    } finally {
      setActiveParsingResumeId(null);
    }
  };

  const handleSetAsProfile = async (resumeId) => {
    try {
      setSettingProfileId(resumeId);
      await assignResumeAsProfile(resumeId);
      toastMessage.success("Profile resume is ready.");
    } catch (error) {
      toastMessage.error(getErrorMessage(error, "Failed to set profile resume."));
    } finally {
      setSettingProfileId(null);
    }
  };

  const handleFinishOnboarding = () => {
    if (!currentUser?.id || !canFinishOnboarding) {
      return;
    }

    clearCandidateOnboardingPending(currentUser.id);
    toastMessage.success("Onboarding completed successfully.");
    navigate("/dashboard", { replace: true });
  };

  const isInitialLoading =
    isLoadingMyInfo || isFetchingMyInfo || isLoadingProfile || isFetchingProfile;

  if (isInitialLoading) {
    return <Loading fullScreen />;
  }

  if (isMyInfoError || isProfileError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-6">
        <Alert
          type="error"
          showIcon
          message="Cannot load onboarding"
          description="Please refresh the page or log in again."
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-white dark:bg-gray-950">
      <SideDecorator />

      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-24 bg-white dark:bg-gray-950 relative z-10">
        <div className="w-full max-w-3xl mx-auto py-12">
          <div className="mb-8">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-3">
              Candidate Onboarding
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
              Let&apos;s finish setting up your candidate profile
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Complete these two steps to start using your dashboard and apply with a ready profile.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div
              className={`rounded-2xl border p-4 transition-colors ${
                currentStep === 1
                  ? "border-primary bg-orange-50/70"
                  : hasBasicProfile
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-gray-200 bg-white"
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">
                Step 1
              </div>
              <div className="text-lg font-bold text-gray-900">Basic Profile</div>
              <p className="text-sm text-gray-500 mt-1">Save your core candidate information.</p>
            </div>
            <div
              className={`rounded-2xl border p-4 transition-colors ${
                currentStep === 2
                  ? "border-primary bg-orange-50/70"
                  : canFinishOnboarding
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-gray-200 bg-white"
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">
                Step 2
              </div>
              <div className="text-lg font-bold text-gray-900">Upload CV</div>
              <p className="text-sm text-gray-500 mt-1">Upload, parse, and set your profile resume.</p>
            </div>
          </div>

          {currentStep === 1 ? (
            <div className="rounded-[28px] border border-gray-200 bg-white shadow-sm p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Basic Profile</h2>
                <p className="text-sm text-gray-500 mt-2">
                  We only need a few basics here. You can refine the rest later in your dashboard.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleProfileSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full name"
                    placeholder="Your name"
                    value={profileForm.fullName}
                    onChange={handleProfileChange("fullName")}
                    error={Boolean(profileErrors.fullName)}
                    helperText={profileErrors.fullName || ""}
                  />
                  <Input
                    label="Job title"
                    placeholder="e.g. Backend Engineer"
                    value={profileForm.jobTitle}
                    onChange={handleProfileChange("jobTitle")}
                    error={Boolean(profileErrors.jobTitle)}
                    helperText={profileErrors.jobTitle || ""}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Phone number"
                    placeholder="Your phone number"
                    value={profileForm.phone}
                    onChange={handleProfileChange("phone")}
                  />
                  <Input
                    label="Address"
                    placeholder="City, Country"
                    value={profileForm.address}
                    onChange={handleProfileChange("address")}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="GitHub URL"
                    placeholder="https://github.com/username"
                    value={profileForm.githubUrl}
                    onChange={handleProfileChange("githubUrl")}
                  />
                  <Input
                    label="LinkedIn URL"
                    placeholder="https://linkedin.com/in/username"
                    value={profileForm.linkedinUrl}
                    onChange={handleProfileChange("linkedinUrl")}
                  />
                </div>

                <Input
                  label="Website URL"
                  placeholder="https://your-site.com"
                  value={profileForm.websiteUrl}
                  onChange={handleProfileChange("websiteUrl")}
                />

                <div className="flex justify-end pt-3">
                  <Button
                    type="submit"
                    mode="primary"
                    size="lg"
                    disabled={isSavingProfile}
                    loading={isSavingProfile}
                  >
                    {isSavingProfile ? "Saving..." : "Save and continue"}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="rounded-[28px] border border-gray-200 bg-white shadow-sm p-6 sm:p-8">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Upload CV</h2>
                  <p className="text-sm text-gray-500 mt-2">
                    Upload your CV, wait for parsing to finish, then set it as your profile resume.
                  </p>
                </div>
                <Button
                  type="button"
                  mode="secondary"
                  size="md"
                  onClick={() => setCurrentStep(1)}
                >
                  Back to profile
                </Button>
              </div>

              <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-6 mb-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-lg font-bold text-gray-900">Upload your latest CV</div>
                    <p className="text-sm text-gray-500 mt-1">
                      Supported formats: PDF, DOC, DOCX. Parsing starts automatically after upload.
                    </p>
                  </div>
                  <div>
                    <input
                      ref={inputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleUploadFile}
                    />
                    <Button
                      type="button"
                      mode="primary"
                      size="lg"
                      onClick={handleUploadClick}
                      disabled={isUploadingAsset || isCreatingResume}
                      loading={isUploadingAsset || isCreatingResume}
                    >
                      {isUploadingAsset || isCreatingResume ? "Uploading..." : "Upload CV"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 mb-6">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500 mb-2">
                  Completion check
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center justify-between gap-4">
                    <span>Job title saved</span>
                    <span className={normalizeText(profile?.jobTitle) ? "text-emerald-600 font-semibold" : "text-amber-600 font-semibold"}>
                      {normalizeText(profile?.jobTitle) ? "Ready" : "Missing"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Profile resume parsed</span>
                    <span className={isProfileResumeReady ? "text-emerald-600 font-semibold" : "text-amber-600 font-semibold"}>
                      {isProfileResumeReady ? "Ready" : "Not ready"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {(isLoadingResumes || isFetchingResumes) ? (
                  <Loading className="py-4" />
                ) : resumeItems.length === 0 ? (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-500">
                    No resume uploaded yet. Upload one to continue onboarding.
                  </div>
                ) : (
                  resumeItems.map((resume) => (
                    <div
                      key={resume.id}
                      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                          <div className="text-lg font-bold text-gray-900 truncate">{resume.name}</div>
                          {resume.fileName ? (
                            <div className="text-sm text-gray-500 mt-1 truncate">{resume.fileName}</div>
                          ) : null}
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold tracking-wide mt-3 ${resume.statusView.className}`}
                          >
                            {resume.statusView.label}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          {resume.status === "FAIL" || resume.status === "WAITING" ? (
                            <Button
                              type="button"
                              mode="secondary"
                              size="md"
                              onClick={() => handleRetryParse(resume.id)}
                              disabled={activeParsingResumeId === resume.id}
                              loading={activeParsingResumeId === resume.id}
                            >
                              {activeParsingResumeId === resume.id ? "Parsing..." : "Parse resume"}
                            </Button>
                          ) : null}

                          {resume.status === "FINISH" ? (
                            <Button
                              type="button"
                              mode="primary"
                              size="md"
                              onClick={() => handleSetAsProfile(resume.id)}
                              disabled={
                                settingProfileId === resume.id || isSettingResumeAsProfile
                              }
                              loading={
                                settingProfileId === resume.id || isSettingResumeAsProfile
                              }
                            >
                              {settingProfileId === resume.id ? "Saving..." : "Set as profile"}
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-end pt-8">
                <Button
                  type="button"
                  mode="primary"
                  size="lg"
                  onClick={handleFinishOnboarding}
                  disabled={!canFinishOnboarding}
                >
                  Finish onboarding
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
