const PENDING_ONBOARDING_PREFIX = "candidate_onboarding_pending:";
const PENDING_ONBOARDING_VALUE = "1";

const getPendingOnboardingKey = (userId) => {
  if (userId == null || userId === "") {
    return null;
  }

  return `${PENDING_ONBOARDING_PREFIX}${userId}`;
};

export const markCandidateOnboardingPending = (userId) => {
  const storageKey = getPendingOnboardingKey(userId);
  if (!storageKey) return;

  localStorage.setItem(storageKey, PENDING_ONBOARDING_VALUE);
};

export const clearCandidateOnboardingPending = (userId) => {
  const storageKey = getPendingOnboardingKey(userId);
  if (!storageKey) return;

  localStorage.removeItem(storageKey);
};

export const hasCandidateOnboardingPending = (userId) => {
  const storageKey = getPendingOnboardingKey(userId);
  if (!storageKey) return false;

  return localStorage.getItem(storageKey) === PENDING_ONBOARDING_VALUE;
};
