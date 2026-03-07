import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import aiLoadingAnimation from "@/assets/lottie/ai-loading.json";

const ANALYSIS_STEPS = [
  { icon: "description", label: "Parsing resume content", delay: 0 },
  { icon: "work_outline", label: "Analyzing job requirements", delay: 2500 },
  { icon: "psychology", label: "Evaluating skill alignment", delay: 5500 },
  { icon: "bar_chart", label: "Calculating match score", delay: 8500 },
  { icon: "auto_awesome", label: "Generating insights", delay: 11500 },
];

const TIPS = [
  "💡 Tip: Tailor your resume keywords to each job description for a higher match score.",
  "💡 Tip: Including measurable achievements can improve your overall evaluation.",
  "💡 Tip: Make sure your skills section covers both technical and soft skills.",
  "💡 Tip: A well-structured resume helps AI parse your qualifications more accurately.",
  "💡 Tip: Keep your work experience concise — focus on impact, not just responsibilities.",
];

const MatchingLoading = ({ status = "WAITING" }) => {
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  const subtitle =
    status === "PARTIAL"
      ? "AI is analyzing your resume in depth. Please keep this page open."
      : "AI matching is queued and will start shortly. Please wait a moment.";

  useEffect(() => {
    const timers = ANALYSIS_STEPS.map((step, index) =>
      setTimeout(() => setVisibleSteps(index + 1), step.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((previous) => (previous + 1) % TIPS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F3F4F6] px-4 py-8 md:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
          <div className="flex max-w-xl flex-col items-center text-center">
            <div className="h-[180px] w-[180px] md:h-[220px] md:w-[220px]">
              <Lottie animationData={aiLoadingAnimation} loop autoplay />
            </div>

            <h1 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
              AI matching in progress
            </h1>
            <p className="mt-3 text-sm text-gray-600 md:text-base">{subtitle}</p>
          </div>

          <div className="mt-6 flex items-center gap-2">
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className="h-2 w-2 rounded-full bg-primary"
                style={{
                  animation: "pulse-dot 1.4s ease-in-out infinite",
                  animationDelay: `${index * 0.25}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-500">
            What's happening
          </h2>

          <div className="space-y-4">
            {ANALYSIS_STEPS.map((step, index) => {
              const isVisible = index < visibleSteps;
              const isActive = index === visibleSteps - 1;

              return (
                <div
                  key={step.label}
                  className="flex items-center gap-4 transition-all duration-500"
                  style={{
                    opacity: isVisible ? 1 : 0.3,
                    transform: isVisible ? "translateX(0)" : "translateX(12px)",
                    transition: "opacity 0.5s ease, transform 0.5s ease",
                  }}
                >
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-colors duration-500 ${
                      isActive
                        ? "bg-primary/15 text-primary"
                        : isVisible
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isVisible && !isActive ? (
                      <span className="material-icons-round text-[20px]">check_circle</span>
                    ) : (
                      <span className="material-icons-round text-[20px]">{step.icon}</span>
                    )}
                  </div>

                  <span
                    className={`text-sm font-medium transition-colors duration-500 ${
                      isActive
                        ? "text-gray-900"
                        : isVisible
                          ? "text-gray-500"
                          : "text-gray-400"
                    }`}
                  >
                    {step.label}
                    {isActive ? (
                      <span className="ml-2 inline-block h-1.5 w-1.5 animate-ping rounded-full bg-primary align-middle" />
                    ) : null}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gradient-to-r from-primary/5 to-orange-50 p-5 shadow-sm md:p-6">
          <p
            key={currentTip}
            className="text-center text-sm text-gray-700 md:text-base"
            style={{
              animation: "fade-in-up 0.45s ease-out",
            }}
          >
            {TIPS[currentTip]}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MatchingLoading;
