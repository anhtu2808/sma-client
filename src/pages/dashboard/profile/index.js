import React from "react";
import { Alert, Col, Row, Spin } from "antd";
import { useCandidateDashboardProfileQuery } from "@/apis/candidateApi";
import ProfileHeader from "@/pages/dashboard/profile/profile-header";
import WorkExperience from "@/pages/dashboard/profile/work-experience";
import Education from "@/pages/dashboard/profile/education";
import Skills from "@/pages/dashboard/profile/skills";
import Projects from "@/pages/dashboard/profile/projects";
import Certifications from "@/pages/dashboard/profile/certifications";

const Profile = () => {
  const { isLoading, isFetching, isError } = useCandidateDashboardProfileQuery();

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
          <ProfileHeader />
        </Col>

        <Col span={24}>
          <WorkExperience />
        </Col>

        <Col span={24}>
          <Education />
        </Col>

        <Col span={24}>
          <Skills />
        </Col>

        <Col span={24}>
          <Projects />
        </Col>

        <Col span={24}>
          <Certifications />
        </Col>
      </Row>
    </div>
  );
};

export default Profile;

