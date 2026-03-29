import React from "react";
import { enumToLabel, formatRange } from "@/utils/profileUtils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '../../../../../../utils/icons';

const ExperienceSection = ({ data }) => {
  const experiences = data?.experiences ?? [];
  if (experiences.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
        <FontAwesomeIcon icon={faBriefcase} className="text-primary text-[18px]" />
        Work Experience
      </h3>
      <div className="space-y-4">
        {experiences.map((exp) => {
          const details = exp?.details ?? [];
          return (
            <div key={exp?.id} className="rounded-xl border border-gray-200 p-4">
              <div className="mb-2">
                <h4 className="text-base font-bold text-gray-900">{exp?.company || "N/A"}</h4>
                <p className="text-xs text-gray-500">
                  {formatRange(exp?.startDate, exp?.endDate, exp?.isCurrent)}
                </p>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {exp?.workingModel && (
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                      {enumToLabel(exp.workingModel)}
                    </span>
                  )}
                  {exp?.employmentType && (
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                      {enumToLabel(exp.employmentType)}
                    </span>
                  )}
                </div>
              </div>

              {details.length > 0 && (
                <div className="space-y-3 mt-3">
                  {details.map((detail, idx) => (
                    <div key={detail?.id || idx} className="relative pl-6">
                      <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-orange-500" />
                      {idx < details.length - 1 && (
                        <div className="absolute left-[4px] top-4 bottom-[-8px] w-[2px] bg-orange-200" />
                      )}
                      <h5 className="text-sm font-semibold text-gray-900">{detail?.title || "Untitled role"}</h5>
                      <p className="text-xs text-gray-500 mb-1">
                        {formatRange(detail?.startDate, detail?.endDate, detail?.isCurrent)}
                      </p>
                      {detail?.description && (
                        <p className="text-xs text-gray-700 leading-5">{detail.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExperienceSection;
