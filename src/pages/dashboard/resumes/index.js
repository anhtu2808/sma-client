import React, { useMemo, useState } from "react";
import { Col, Row, Tabs, message } from "antd";
import ResumeBuilderTab from "./tabs/resume-buider";
import AttachmentsTab from "./tabs/attachment";

const Resumes = () => {
  const [viewMode, setViewMode] = useState("grid");

  const handleCreateResume = () => {
    message.info("Create resume: coming soon");
  };

  const tabItems = useMemo(
    () => [
      {
        key: "builder",
        label: (
          <span className="inline-flex items-center gap-2">
            <span className="material-icons-round text-[20px]">article</span>
            Resume Builder
          </span>
        ),
        children: (
          <ResumeBuilderTab
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            onCreateResume={handleCreateResume}
          />
        ),
      },
      {
        key: "attachments",
        label: (
          <span className="inline-flex items-center gap-2">
            <span className="material-icons-round text-[20px]">attach_file</span>
            Attachments
          </span>
        ),
        children: <AttachmentsTab />,
      },
    ],
    [viewMode]
  );

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Resumes</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your resumes and attachments.</p>
            </div>
          </div>
        </Col>

        <Col span={24}>
          <Tabs defaultActiveKey="builder" items={tabItems} />
        </Col>
      </Row>
    </div>
  );
};

export default Resumes;

