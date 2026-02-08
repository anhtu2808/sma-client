import React from "react";
import { Col, Row } from "antd";
import Button from "@/components/Button";
import { useCandidateDashboardProfileQuery } from "@/apis/candidateApi";
import { getValidLink, getHostLabel } from "@/utils/profileUtils";

const ProfileHeader = () => {
  const { data: profile } = useCandidateDashboardProfileQuery();

  const displayName = profile?.fullName || profile?.email || "Candidate";
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const aboutMe = profile?.jobTitle
    ? `${profile.jobTitle} profile synced from your PROFILE resume.`
    : "Profile information synced from your PROFILE resume.";

  return (
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
  );
};

export default ProfileHeader;
