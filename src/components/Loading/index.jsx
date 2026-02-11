import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "@/assets/lottie/loading.json";

const Loading = ({
  size = 120,
  fullScreen = false,
  inline = false,
  className = "",
}) => {
  const containerClass = inline
    ? "inline-flex items-center justify-center"
    : fullScreen
      ? "min-h-screen flex items-center justify-center"
      : "w-full flex items-center justify-center py-10";

  return (
    <div className={`${containerClass} ${className}`.trim()}>
      <div className="flex flex-col items-center">
        <div style={{ width: size, height: size }}>
          <Lottie animationData={loadingAnimation} loop autoplay />
        </div>
      </div>
    </div>
  );
};

export default Loading;
