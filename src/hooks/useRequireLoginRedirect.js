import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toastMessage from "@/utils/toastMessage";

const useRequireLoginRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const requireLogin = useCallback(
    ({ warningMessage = "Please log in to continue.", redirectTo } = {}) => {
      const hasAccessToken = Boolean(localStorage.getItem("accessToken"));
      if (hasAccessToken) {
        return true;
      }

      toastMessage.warning(warningMessage);
      const targetPath =
        redirectTo || `${location.pathname}${location.search}${location.hash}`;
      navigate(`/login?redirect=${encodeURIComponent(targetPath)}`);
      return false;
    },
    [location.hash, location.pathname, location.search, navigate]
  );

  return requireLogin;
};

export default useRequireLoginRedirect;
