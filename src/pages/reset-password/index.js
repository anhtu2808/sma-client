import React, { useState, useEffect } from "react";
import toastMessage from "@/utils/toastMessage";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "@/components/Input";
import Button from "@/components/Button";
import SideDecorator from "@/pages/forgot-password/side-decorator";

import authService from "@/services/authService";

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isResetting, setIsResetting] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        if (!location.state?.email) {
            toastMessage.error("Please enter your email first");
            navigate("/forgot-password");
        } else {
            setEmail(location.state.email);
        }
    }, [location, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            message.error("Passwords do not match");
            return;
        }

        try {
            setIsResetting(true);
            // First reset password
            await authService.resetPassword({ email, otp, newPassword });
            setIsResetting(false);

            // Then auto-login
            setIsLoggingIn(true);
            const response = await authService.login({ email, password: newPassword });

            if (response.data.code === 200) {
                const isCandidate = await authService.verifyCandidateRole();
                if (!isCandidate) {
                    toastMessage.error("This account is not authorized to access the candidate portal");
                    return;
                }
                toastMessage.success("Password reset and logged in successfully");
                navigate("/");
            } else {
                toastMessage.error(response.data.message || "Reset successful but login failed");
                navigate("/login");
            }
        } catch (error) {
            console.error("Failed to reset password:", error);
            toastMessage.error(error.response?.data?.message || error.message || "Failed to reset password");
            setIsResetting(false);
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Left Side Decorator */}
            <SideDecorator />

            {/* Right Side Form */}
            <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative bg-white dark:bg-gray-900 z-10 overflow-y-auto">

                {/* Faint Shield Background */}
                <div className="absolute -bottom-16 -right-16 pointer-events-none opacity-[0.03] dark:opacity-5">
                    <svg width="500" height="500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 20.82C7.8 20.62 4.5 16.32 4.5 11V6.3l7.5-3.33 7.5 3.33V11c0 5.32-3.3 9.62-7.5 10.82zM12 3v18.8c4.2-1.2 7.5-5.5 7.5-10.8V6.3L12 3z" />
                    </svg>
                </div>

                <div className="w-full max-w-md mx-auto py-12 relative z-10">
                    <h2 className="text-[2.25rem] font-extrabold text-[#3a2b25] dark:text-white mb-3 tracking-tight leading-tight">
                        Create new password
                    </h2>
                    <p className="text-[#8c746a] dark:text-gray-400 mb-10 text-[0.95rem] leading-relaxed">
                        Enter the OTP sent to your email and your new password to regain access.
                    </p>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="block text-[0.85rem] font-bold text-[#3a2b25] dark:text-gray-300">
                                Email address
                            </label>
                            <Input
                                type="email"
                                value={email}
                                disabled
                                className="bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                                prefix={<span className="material-icons-round text-gray-400" style={{ fontSize: '20px' }}>mail</span>}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[0.85rem] font-bold text-[#3a2b25] dark:text-gray-300">
                                OTP Code
                            </label>
                            <Input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                prefix={<span className="material-icons-round text-gray-400" style={{ fontSize: '20px' }}>vpn_key</span>}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[0.85rem] font-bold text-[#3a2b25] dark:text-gray-300">
                                New Password
                            </label>
                            <Input.Password
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                prefix={<span className="material-icons-round text-gray-400" style={{ fontSize: '20px' }}>lock</span>}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[0.85rem] font-bold text-[#3a2b25] dark:text-gray-300">
                                Confirm Password
                            </label>
                            <Input.Password
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                prefix={<span className="material-icons-round text-gray-400" style={{ fontSize: '20px' }}>lock</span>}
                            />
                        </div>

                        <Button
                            type="submit"
                            mode="primary"
                            size="lg"
                            fullWidth
                            disabled={isResetting || isLoggingIn}
                            loading={isResetting || isLoggingIn}
                            className="mt-6 font-bold"
                        >
                            {isLoggingIn ? "Logging in..." : isResetting ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
