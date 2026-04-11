import React, { useState, useEffect, useRef } from "react";
import toastMessage from "@/utils/toastMessage";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import SideDecorator from "@/pages/login/side-decorator";
import authService from "@/services/authService";

const RESEND_COOLDOWN = 60;
const OTP_LENGTH = 6;

const maskEmail = (email) => {
    if (!email) return "";
    const [local, domain] = email.split("@");
    if (local.length <= 2) return `${local[0]}***@${domain}`;
    return `${local[0]}${local[1]}***@${domain}`;
};

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN);
    const [resending, setResending] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (!location.state?.email) {
            toastMessage.error("Please register first");
            navigate("/register");
        } else {
            setEmail(location.state.email);
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
    }, [location, navigate]);

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) { clearInterval(timer); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [resendCooldown]);

    const handleDigitChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newDigits = [...digits];
        newDigits[index] = value.slice(-1);
        setDigits(newDigits);
        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!pasted) return;
        const newDigits = Array(OTP_LENGTH).fill("");
        pasted.split("").forEach((ch, i) => { newDigits[i] = ch; });
        setDigits(newDigits);
        const nextEmpty = pasted.length < OTP_LENGTH ? pasted.length : OTP_LENGTH - 1;
        inputRefs.current[nextEmpty]?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otp = digits.join("");
        if (otp.length < OTP_LENGTH) {
            toastMessage.error("Please enter the full 6-digit code");
            return;
        }
        try {
            setLoading(true);
            await authService.verifyEmail({ email, otp });
            toastMessage.success("Email verified! You can now log in.");
            navigate("/login");
        } catch (error) {
            toastMessage.error(error.response?.data?.message || "Verification failed. Please try again.");
            setDigits(Array(OTP_LENGTH).fill(""));
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;
        try {
            setResending(true);
            await authService.resendVerificationEmail(email);
            toastMessage.success("Verification email resent! Please check your inbox.");
            setResendCooldown(RESEND_COOLDOWN);
            setDigits(Array(OTP_LENGTH).fill(""));
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        } catch (error) {
            toastMessage.error(error.response?.data?.message || "Failed to resend. Please try again.");
        } finally {
            setResending(false);
        }
    };

    const isComplete = digits.every((d) => d !== "");

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <SideDecorator />

            <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative bg-white dark:bg-gray-900 z-10 overflow-y-auto">
                {/* Faint background icon */}
                <div className="absolute -bottom-16 -right-16 pointer-events-none opacity-[0.03] dark:opacity-5">
                    <svg width="500" height="500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                </div>

                <div className="w-full max-w-md mx-auto py-12 relative z-10">
                    {/* Icon badge */}
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                    </div>

                    <h2 className="text-[2.25rem] font-extrabold text-[#3a2b25] dark:text-white mb-3 tracking-tight leading-tight">
                        Check your email
                    </h2>
                    <p className="text-[#8c746a] dark:text-gray-400 mb-10 text-[0.95rem] leading-relaxed">
                        We sent a 6-digit code to{" "}
                        <span className="font-semibold text-[#3a2b25] dark:text-white">{maskEmail(email)}</span>.
                        Enter it below to activate your account.
                    </p>

                    <form onSubmit={handleSubmit}>
                        {/* OTP digit boxes */}
                        <div className="flex gap-3 justify-center mb-8" onPaste={handlePaste}>
                            {digits.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleDigitChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-150
                                        bg-white dark:bg-gray-800 dark:text-white
                                        focus:outline-none focus:ring-0
                                        ${digit
                                            ? "border-primary text-primary dark:border-primary"
                                            : "border-gray-200 dark:border-gray-700 text-gray-900"
                                        }
                                        focus:border-primary`}
                                />
                            ))}
                        </div>

                        <Button
                            type="submit"
                            mode="primary"
                            size="lg"
                            fullWidth
                            disabled={loading || !isComplete}
                            loading={loading}
                            className="font-bold"
                        >
                            {loading ? "Verifying..." : "Verify Email"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Didn't receive the code?{" "}
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resendCooldown > 0 || resending}
                                className={`font-bold transition-colors ${
                                    resendCooldown > 0 || resending
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-[#3a2b25] dark:text-white underline hover:text-primary cursor-pointer"
                                }`}
                            >
                                {resending ? "Sending..." : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
