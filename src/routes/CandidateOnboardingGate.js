import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCandidateProfileQuery } from "@/apis/candidateApi";
import Loading from "@/components/Loading";
import authService from "@/services/authService";
import { hasCandidateOnboardingPending } from "@/utils/candidateOnboardingStorage";

const ONBOARDING_PATH = "/onboarding";

const CandidateOnboardingGate = () => {
  const isAuthenticated = authService.isAuthenticated();
  const location = useLocation();
  const navigate = useNavigate();
  const { data, isLoading, isFetching } = useCandidateProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const user = data?.data?.user ?? null;
  const pendingOnboarding = user?.id != null && hasCandidateOnboardingPending(user.id);

  useEffect(() => {
    if (!isAuthenticated || isLoading || isFetching || !user) {
      return;
    }

    if (user.role !== "CANDIDATE") {
      authService.clearTokens();
      navigate("/login", { replace: true });
      return;
    }

    if (pendingOnboarding && location.pathname !== ONBOARDING_PATH) {
      navigate(ONBOARDING_PATH, { replace: true });
      return;
    }

    if (!pendingOnboarding && location.pathname === ONBOARDING_PATH) {
      navigate("/dashboard", { replace: true });
    }
  }, [
    isAuthenticated,
    isFetching,
    isLoading,
    location.pathname,
    navigate,
    pendingOnboarding,
    user,
  ]);

  if (isAuthenticated && (isLoading || isFetching)) {
    return <Loading fullScreen />;
  }

  return <Outlet />;
};

export default CandidateOnboardingGate;
