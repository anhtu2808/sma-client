import React, { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import Input from "@/components/Input";
import Button from "@/components/Button";
import SideDecorator from "./side-decorator";
import authService from "@/services/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword({ email });
      message.success("OTP has been sent to your email.");
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      console.error("Failed to send reset link:", error);
      message.error(error.response?.data?.message || error.message || "Failed to send reset link");
    } finally {
      setLoading(false);
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
            Reset your password
          </h2>
          <p className="text-[#8c746a] dark:text-gray-400 mb-10 text-[0.95rem] leading-relaxed">
            Enter the email address associated with your account and we'll send you a link to reset your password.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-[0.85rem] font-bold text-[#3a2b25] dark:text-gray-300">
                Email address
              </label>
              <Input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                prefix={<span className="material-icons-round text-gray-400" style={{ fontSize: '20px' }}>mail</span>}
              />
            </div>

            <Button
              type="submit"
              mode="primary"
              size="lg"
              fullWidth
              disabled={loading}
              loading={loading}
              className="mt-6 font-bold"
              iconRight={<span className="material-icons-round ml-1" style={{ fontSize: '20px' }}>arrow_forward</span>}
            >
              Send Reset Link
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
