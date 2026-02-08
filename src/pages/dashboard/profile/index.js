import React from "react";
import { Alert, Col, Empty, Row, Spin } from "antd";
import Button from "@/components/Button";
import { useCandidateDashboardProfileQuery } from "@/apis/candidateApi";

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatRange = (startDate, endDate, isCurrent) => {
  const start = formatDate(startDate);
  const end = isCurrent ? "Present" : formatDate(endDate);
  if (start === "N/A" && end === "N/A") return "N/A";
  return `${start} - ${end}`;
};

const getValidLink = (url) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
};

const getHostLabel = (url) => {
  if (!url) return null;
  const safeUrl = getValidLink(url);
  try {
    return new URL(safeUrl).host;
  } catch (error) {
    return url;
  }
};

const Profile = () => {
  const { data: profile, isLoading, isFetching, isError } = useCandidateDashboardProfileQuery();

  const skills = profile?.skills ?? [];
  const educations = profile?.educations ?? [];
  const experiences = profile?.experiences ?? [];
  const projects = profile?.projects ?? [];
  const certifications = profile?.certifications ?? [];

  const groupedSkills = skills.reduce((acc, skill) => {
    const key = skill?.skillCategoryName || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(skill);
    return acc;
  }, {});

  const displayName = profile?.fullName || profile?.email || "Candidate";
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const aboutMe = profile?.jobTitle
    ? `${profile.jobTitle} profile synced from your PROFILE resume.`
    : "Profile information synced from your PROFILE resume.";

  if (isLoading || isFetching) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        type="error"
        showIcon
        message="Cannot load profile"
        description="Please try again later."
      />
    );
  }

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 relative">
            <div className="absolute top-6 right-6 flex gap-2">
              <button
                type="button"
                className="text-gray-400 hover:text-primary p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                title="Export PDF"
              >
                <span className="material-icons-round">picture_as_pdf</span>
              </button>
              <Button
                mode="secondary"
                size="sm"
                shape="rounded"
                className="!border-gray-200 dark:!border-gray-600 dark:!text-gray-200"
                iconLeft={<span className="material-icons-round text-[18px]">edit</span>}
              >
                Edit Profile
              </Button>
            </div>

            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} md={6} lg={4}>
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-4 border-white dark:border-gray-800 shadow-md mx-auto md:mx-0">
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-semibold">
                      {avatarLetter}
                    </div>
                  )}
                </div>
              </Col>
              <Col xs={24} md={18} lg={20}>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{displayName}</h1>
                <p className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-4">
                  {profile?.jobTitle || "Not updated yet"}
                </p>
                <Row gutter={[16, 12]}>
                  <Col xs={24} md={12}>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="material-icons-round text-[18px]">mail</span>
                      {profile?.email || "N/A"}
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="material-icons-round text-[18px]">call</span>
                      {profile?.phone || "N/A"}
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="material-icons-round text-[18px]">location_on</span>
                      {profile?.address || "N/A"}
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    {profile?.githubUrl ? (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="material-icons-round text-[18px] text-gray-500 dark:text-gray-400">
                          link
                        </span>
                        <a
                          className="text-primary hover:underline"
                          href={getValidLink(profile.githubUrl)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {getHostLabel(profile.githubUrl)}
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="material-icons-round text-[18px]">link_off</span>
                        N/A
                      </div>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>

            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 rounded-r-md p-4">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{aboutMe}</p>
            </div>
          </div>
        </Col>

        <Col span={24}>
          <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg text-primary">
                <span className="material-icons-round">person</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Profile Snapshot</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-700 dark:text-gray-200">Resume: </span>
                {profile?.profileResumeName || "N/A"}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-700 dark:text-gray-200">Availability: </span>
                {formatDate(profile?.availabilityDate)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-700 dark:text-gray-200">Profile public: </span>
                {profile?.isProfilePublic ? "Yes" : "No"}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-700 dark:text-gray-200">LinkedIn: </span>
                {profile?.linkedinUrl ? (
                  <a className="text-primary hover:underline" href={getValidLink(profile.linkedinUrl)} target="_blank" rel="noreferrer">
                    {getHostLabel(profile.linkedinUrl)}
                  </a>
                ) : (
                  "N/A"
                )}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-700 dark:text-gray-200">Website: </span>
                {profile?.websiteUrl ? (
                  <a className="text-primary hover:underline" href={getValidLink(profile.websiteUrl)} target="_blank" rel="noreferrer">
                    {getHostLabel(profile.websiteUrl)}
                  </a>
                ) : (
                  "N/A"
                )}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-700 dark:text-gray-200">Expected salary: </span>
                {profile?.expectedSalaryMin || profile?.expectedSalaryMax
                  ? `${profile?.expectedSalaryMin || 0} - ${profile?.expectedSalaryMax || 0}`
                  : "N/A"}
              </div>
            </div>
          </div>
        </Col>

        <Col span={24}>
          <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg text-primary">
                  <span className="material-icons-round">work</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Work Experience</h2>
              </div>
            </div>
            <div className="p-6 space-y-8">
              {experiences.length === 0 ? (
                <Empty description="No experience found" />
              ) : (
                experiences.map((experience) => {
                  const firstDetail = experience?.details?.[0];
                  const detailSkills = firstDetail?.skills ?? [];

                  return (
                    <div key={experience?.id} className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-gray-800" />
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                        <div>
                          <h3 className="text-base font-bold text-gray-900 dark:text-white">
                            {firstDetail?.title || firstDetail?.position || "N/A"}
                          </h3>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{experience?.company || "N/A"}</p>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded mt-2 sm:mt-0 inline-block">
                          {formatRange(experience?.startDate, experience?.endDate, experience?.isCurrent)}
                        </span>
                      </div>

                      <div className="mt-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700/50">
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Key Responsibilities
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          {firstDetail?.description || "N/A"}
                        </p>
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Skills Used
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {detailSkills.length === 0 ? (
                            <span className="text-sm text-gray-500 dark:text-gray-400">N/A</span>
                          ) : (
                            detailSkills.map((skill) => (
                              <span
                                key={skill?.id}
                                className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs font-medium text-gray-500 dark:text-gray-300"
                              >
                                {skill?.skillName || "N/A"}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </Col>

        <Col span={24}>
          <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg text-primary">
                <span className="material-icons-round">school</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Education</h2>
            </div>
            <div className="p-6 space-y-6">
              {educations.length === 0 ? (
                <Empty description="No education found" />
              ) : (
                educations.map((education) => (
                  <div key={education?.id} className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded flex-shrink-0 flex items-center justify-center text-gray-400">
                      <span className="material-icons-round text-[22px]">apartment</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">{education?.institution || "N/A"}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {[education?.degree, education?.majorField].filter(Boolean).join(" - ") || "N/A"}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatRange(education?.startDate, education?.endDate, education?.isCurrent)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-4 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium border border-green-100 dark:border-green-800">
                          <span className="material-icons-round text-[14px]">grade</span>
                          GPA: {education?.gpa ?? "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Col>

        <Col span={24}>
          <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg text-primary">
                <span className="material-icons-round">psychology</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Skills</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(groupedSkills).length === 0 ? (
                <Empty description="No skills found" />
              ) : (
                Object.entries(groupedSkills).map(([categoryName, categorySkills]) => (
                  <div key={categoryName}>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" /> {categoryName}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <div
                          key={skill?.id}
                          className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm flex items-center gap-2"
                        >
                          {skill?.skillName || skill?.rawSkillSection || "N/A"}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Col>

        <Col span={24}>
          <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg text-primary">
                <span className="material-icons-round">rocket_launch</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Featured Projects</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.length === 0 ? (
                <Empty description="No projects found" />
              ) : (
                projects.map((project) => (
                  <div
                    key={project?.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary/50 transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                        {project?.title || "N/A"}
                      </h3>
                      {project?.projectUrl ? (
                        <a
                          className="text-gray-500 hover:text-primary transition-colors"
                          href={getValidLink(project.projectUrl)}
                          target="_blank"
                          rel="noreferrer"
                          title="View Project"
                        >
                          <span className="material-icons-round text-[18px]">open_in_new</span>
                        </a>
                      ) : null}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                      {project?.description || "N/A"}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-mono text-primary bg-primary/5 px-2 py-1 rounded w-fit">
                      <span className="material-icons-round text-[14px]">calendar_month</span>
                      {formatRange(project?.startDate, project?.endDate, project?.isCurrent)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Col>

        <Col span={24}>
          <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <span className="material-icons-round text-primary">workspace_premium</span>
              <h2 className="font-bold text-gray-900 dark:text-white">Certificates</h2>
            </div>
            <div className="p-4 space-y-4">
              {certifications.length === 0 ? (
                <Empty description="No certificates found" />
              ) : (
                certifications.map((certification) => (
                  <div key={certification?.id} className="flex gap-3">
                    <div className="mt-1">
                      <span className="material-icons-round text-yellow-500 text-[18px]">star</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">{certification?.name || "N/A"}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {certification?.issuer || "N/A"}
                      </p>
                      {certification?.credentialUrl ? (
                        <a
                          href={getValidLink(certification.credentialUrl)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          {getHostLabel(certification.credentialUrl)}
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
