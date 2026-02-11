import React from "react";
import { Alert, Col, Row } from "antd";
import { useCandidateDashboardProfileQuery } from "@/apis/candidateApi";
import Loading from "@/components/Loading";
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
      <Loading className="h-[50vh]" />
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
