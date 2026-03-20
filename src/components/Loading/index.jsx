import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "@/assets/lottie/loading.json";

const Loading = ({
  size,
  fullScreen = false,
  inline = false,
  className = "",
}) => {
  const resolvedSize = size ?? (inline ? 24 : fullScreen ? 180 : 150);
  const shouldBoostDefaultLoader = size == null && !inline;
  const zoom = shouldBoostDefaultLoader ? (fullScreen ? 2.1 : 1.8) : 1;

  const containerClass = inline
    ? "inline-flex items-center justify-center"
    : fullScreen
      ? "min-h-screen flex items-center justify-center"
      : "w-full flex items-center justify-center py-10";

  return (
    <div className={`${containerClass} ${className}`.trim()}>
      <div className="flex flex-col items-center">
        <div
          style={{
            width: resolvedSize,
            height: resolvedSize,
            overflow: inline ? "hidden" : "visible",
          }}
        >
          <Lottie
            animationData={loadingAnimation}
            loop
            autoplay
            style={{
              width: "100%",
              height: "100%",
              transform: `scale(${zoom})`,
              transformOrigin: "center",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Loading;
