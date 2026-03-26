import React from "react";
import BasicInfoSection from "./BasicInfoSection";
import SkillsSection from "./SkillsSection";
import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";
import ProjectsSection from "./ProjectsSection";
import CertificationsSection from "./CertificationsSection";

const ParsedResultPreview = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <BasicInfoSection data={data} />
      <SkillsSection data={data} />
      <ExperienceSection data={data} />
      <EducationSection data={data} />
      <ProjectsSection data={data} />
      <CertificationsSection data={data} />
    </div>
  );
};

export default ParsedResultPreview;
