import React from "react";

const StatusTimeline = ({ status }) => {
  const isRejected = ['AUTO_REJECTED', 'NOT_SUITABLE'].includes(status);
  const isViewed = ['VIEWED', 'SHORTLISTED'].includes(status);

  let steps = isRejected
    ? [
        { label: "Applied" },
        { label: "Application not delivered", error: true },
      ]
    : [
        { label: "Applied" },
        { label: "Application delivered" },
        { label: "Employer viewed", done: isViewed },
      ];

  steps = [...steps].reverse();

  return (
    <div className="space-y-4">
      {steps.map((step, idx) => {
        const isDone = step.done !== false;
        const isLast = idx === steps.length - 1;
        const dotColor = step.error
          ? "bg-red-500"
          : isDone
          ? "bg-orange-500"
          : "bg-gray-300";

        return (
          <div key={step.label} className="relative pl-7">
            <div className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full ${dotColor}`} />

            {!isLast && (
              <div className="absolute left-[4.5px] top-[18px] bottom-[-18px] w-[1.5px] bg-gray-200 dark:bg-gray-700" />
            )}

            <span
              className={`text-sm font-semibold leading-tight ${
                step.error
                  ? "text-red-600"
                  : isDone
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default StatusTimeline;


