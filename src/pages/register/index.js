import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toastMessage from "@/utils/toastMessage";
import Input from "@/components/Input";
import Button from "@/components/Button";
import SideDecorator from "@/pages/login/side-decorator";
import googleIcon from "@/assets/svg/google-icon.svg";
import authService from "@/services/authService";
import { GoogleLogin } from "@react-oauth/google";
import {
  hasCandidateOnboardingPending,
  markCandidateOnboardingPending,
} from "@/utils/candidateOnboardingStorage";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toastMessage.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await authService.registerAsCandidate({
        email,
        password,
        fullName,
      });

      if (response.data.code === 200) {
        toastMessage.success("Registration successful! Please check your email to verify your account.");
        navigate("/verify-email", { state: { email } });
      } else {
        toastMessage.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      toastMessage.error(
        error.response?.data?.message ||
          "An error occurred during registration",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);

      const res = await authService.loginWithGoogle(
        credentialResponse.credential,
      );

      if (res.data.code === 200) {
        const { isCandidate, user } = await authService.getCandidateAccess();
        if (!isCandidate) {
          toastMessage.error("This account is not authorized to access the candidate portal");
          return;
        }

        if (res.data?.data?.shouldStartOnboarding && user?.id) {
          markCandidateOnboardingPending(user.id);
        }

        toastMessage.success(res.data.message || "Login successfully");
        const nextPath =
          user?.id && hasCandidateOnboardingPending(user.id)
            ? "/onboarding"
            : "/";
        navigate(nextPath, { replace: true });
      } else {
        toastMessage.error(res.data.message || "Login failed");
      }
    } catch (error) {
      toastMessage.error(error.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <SideDecorator />
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative bg-white dark:bg-gray-900 z-10 overflow-y-auto">
        <div className="w-full max-w-md mx-auto py-12">
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight text-gray-900 dark:text-white">
            Sign Up
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
            Join SmartRecruit and find your dream job!
          </p>
          <div className="flex justify-center mb-5">
            <div className="relative w-full">
              <Button
                type="button"
                mode="secondary"
                size="md"
                fullWidth
                shape="pill"
                className="mb-5"
                iconLeft={
                  <img src={googleIcon} alt="Google" className="w-5 h-5" />
                }
              >
                Sign up with Google
              </Button>
              <div
                className="absolute inset-0 opacity-0"
                style={{ pointerEvents: "auto" }}
              >
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    toastMessage.error("Google login failed");
                  }}
                  useOneTap={false}
                  width="100%"
                  size="large"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
            <span className="text-sm text-gray-400 font-medium">
              or Sign up with Email
            </span>
            <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
          </div>

          {/* Register Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Enter your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input.Password
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input.Password
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                mode="primary"
                size="lg"
                fullWidth
                disabled={loading}
                loading={loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-gray-900 dark:text-white underline hover:text-primary transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
