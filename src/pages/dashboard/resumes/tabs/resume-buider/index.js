import React from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Spin, Empty, Popconfirm, message } from "antd";
import { useGetCandidateResumesQuery, useDeleteCandidateResumeMutation } from "@/apis/resumeApi";
import { RESUME_TYPES } from "@/constant";

const ResumeBuilderTab = () => {
  const navigate = useNavigate();
  const { data: builderResumes = [], isLoading } = useGetCandidateResumesQuery(
    { type: RESUME_TYPES.TEMPLATE }
  );
  const [deleteResume, { isLoading: isDeleting }] = useDeleteCandidateResumeMutation();

  const handleDelete = async (resumeId) => {
    try {
      await deleteResume({ resumeId }).unwrap();
      message.success("Đã xóa CV thành công.");
    } catch (error) {
      message.error("Không thể xóa CV. Vui lòng thử lại.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Create New Resume Card */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div
          onClick={() => navigate('/dashboard/resumes/templates')}
          className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center p-12 cursor-pointer hover:border-primary hover:bg-orange-50/50 dark:hover:bg-gray-700/50 transition-all group"
        >
          <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-gray-700 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
            <span className="material-icons-round text-[28px] text-primary group-hover:text-white">add</span>
          </div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Create New Resume</h3>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">Choose a professionally designed template to get started building your resume.</p>
        </div>
      </div>

      {/* My Created CVs */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spin size="large" />
        </div>
      ) : builderResumes.length > 0 ? (
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">CV đã tạo</h2>
          <Row gutter={[16, 16]}>
            {builderResumes.map((resume) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={resume.id}>
                <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden h-full flex flex-col group hover:shadow-md transition-shadow">
                  {/* Mini CV Preview */}
                  <div
                    onClick={() => navigate(`/dashboard/resumes/builder?resumeId=${resume.id}`)}
                    className="relative h-44 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 p-4 cursor-pointer"
                  >
                    <div className="w-3/4 h-full bg-white dark:bg-gray-700 rounded-t-lg p-4 border-x border-t border-gray-200 dark:border-gray-600 mx-auto">
                      <div className="w-1/2 h-2 bg-gray-300 dark:bg-gray-500 rounded mb-2" />
                      <div className="w-2/3 h-2 bg-gray-200 dark:bg-gray-600 rounded mb-2" />
                      <div className="w-full h-px bg-gray-200 dark:bg-gray-600 mb-2" />
                      <div className="space-y-2">
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded" />
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded" />
                        <div className="w-3/4 h-1.5 bg-gray-200 dark:bg-gray-600 rounded" />
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm z-10">
                      <span className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-semibold shadow-sm flex items-center gap-2">
                        <span className="material-icons-round text-[18px]">edit</span>
                        Chỉnh sửa
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">
                          {resume.fullName || resume.resumeName || `Resume #${resume.id}`}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(resume.updatedAt || resume.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-2">
                      <button
                        onClick={() => navigate(`/dashboard/resumes/builder?resumeId=${resume.id}`)}
                        className="flex items-center gap-1 text-sm font-medium text-primary hover:text-orange-700 transition-colors cursor-pointer"
                      >
                        <span className="material-icons-round text-[16px]">edit</span>
                        Sửa
                      </button>
                      <Popconfirm
                        title="Xóa CV này?"
                        description="Bạn có chắc muốn xóa CV này không?"
                        onConfirm={() => handleDelete(resume.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true, loading: isDeleting }}
                      >
                        <button
                          className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <span className="material-icons-round text-[16px]">delete</span>
                        </button>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      ) : null}
    </section>
  );
};

export default ResumeBuilderTab;
