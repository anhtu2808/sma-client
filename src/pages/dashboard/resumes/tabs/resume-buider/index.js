import React, { useMemo } from "react";
import { Col, Row } from "antd";
import Button from "@/components/Button";
import { ResumeCard, CreateResumeCard, ResumeListItem } from "../../resume-card";
import { useGetCandidateResumesQuery } from "@/apis/resumeApi";
import { RESUME_TYPES } from "@/constant";

const ViewToggle = ({ viewMode, onChange }) => (
  <div className="flex items-center gap-2">
    <Button
      mode="secondary"
      size="md"
      shape="rounded"
      btnIcon
      onClick={() => onChange("grid")}
    >
      <i className="material-icons-round text-[18px]">grid_view</i>
    </Button>
    <Button
      mode="secondary"
      size="md"
      shape="rounded"
      btnIcon
      onClick={() => onChange("list")}
    >
      <i className="material-icons-round text-[18px]">format_list_bulleted</i>
    </Button>
  </div>
);

const ResumeBuilderTab = ({ viewMode, onChangeViewMode, onCreateResume }) => {
  const { data: resumes = [], isLoading } = useGetCandidateResumesQuery({
    type: RESUME_TYPES.TEMPLATE,
  });

  const resumeItems = useMemo(
    () =>
      resumes.map((resume) => ({
        id: resume.id,
        title: resume.resumeName || resume.fileName || `Resume #${resume.id}`,
        lastModified: `Status: ${resume.status || "DRAFT"}`,
        score: resume.parseStatus === "DONE" ? 100 : resume.parseStatus === "FAIL" ? 35 : 65,
        status: resume.status || "DRAFT",
        tag: resume.type === RESUME_TYPES.TEMPLATE ? "Template" : null,
      })),
    [resumes]
  );

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">My Smart Resumes</h2>
        <ViewToggle viewMode={viewMode} onChange={onChangeViewMode} />
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        {isLoading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading template resumes...</p>
        ) : viewMode === "list" ? (
          <Row gutter={[24, 16]}>
            {resumeItems.map((resume) => (
              <Col span={24} key={resume.id}>
                <ResumeListItem resume={resume} />
              </Col>
            ))}
            <Col span={24}>
              <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Create New Resume</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Start from a template or import data</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Create new resume"
                    onClick={onCreateResume}
                    className="h-11 w-11 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="material-icons-round text-[22px] text-gray-700 dark:text-gray-100">add</span>
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        ) : (
          <Row gutter={[24, 24]}>
            {resumeItems.map((resume) => (
              <Col xs={24} md={12} key={resume.id}>
                <ResumeCard resume={resume} />
              </Col>
            ))}
            <Col xs={24} md={12}>
              <CreateResumeCard onCreate={onCreateResume} />
            </Col>
          </Row>
        )}
      </div>
    </section>
  );
};

export default ResumeBuilderTab;
