import React from "react";
import { enumToLabel, formatRange } from "@/utils/profileUtils";

const EducationSection = ({ data }) => {
  const educations = data?.educations ?? [];
  if (educations.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
        <span className="material-icons-round text-primary text-[18px]">school</span>
        Education
      </h3>
      <div className="space-y-3">
        {educations.map((edu) => (
          <div key={edu?.id} className="flex gap-3 items-start">
            <div className="w-10 h-10 bg-gray-50 rounded flex-shrink-0 flex items-center justify-center text-gray-400">
              <span className="material-icons-round text-[20px]">apartment</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-900">{edu?.institution || "N/A"}</h4>
              <p className="text-xs text-gray-500">
                {[enumToLabel(edu?.degree), edu?.majorField].filter(Boolean).join(" - ") || "N/A"}
              </p>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-xs text-gray-500">
                  {formatRange(edu?.startDate, edu?.endDate, edu?.isCurrent)}
                </span>
                {edu?.gpa != null && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                    <span className="material-icons-round text-[12px]">grade</span>
                    GPA: {edu.gpa}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationSection;
