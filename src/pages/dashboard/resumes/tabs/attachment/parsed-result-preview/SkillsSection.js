import React from "react";
import { formatYearsOfExperience } from "@/utils/profileUtils";
import { Sparkles } from 'lucide-react';

const SkillsSection = ({ data }) => {
  const skillGroups = (data?.skillGroups ?? []).filter((g) => (g?.skills ?? []).length > 0);
  if (skillGroups.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
        <Sparkles size={18} className="text-primary" />
        Skills
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillGroups.map((group) => (
          <div key={group?.id || group?.name}>
            <h4 className="text-xs font-bold text-gray-900 flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              {group?.name || "Ungrouped"}
            </h4>
            <div className="flex flex-wrap gap-2">
              {(group?.skills ?? []).map((skill) => (
                <span
                  key={skill?.id || skill?.skillName}
                  className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-sm flex items-center gap-2"
                >
                  <span className="font-semibold">{skill?.skillName || "Unknown"}</span>
                  {skill?.yearsOfExperience != null && (
                    <span className="text-gray-500">({formatYearsOfExperience(skill.yearsOfExperience)})</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
