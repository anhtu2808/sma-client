import React from "react";
import { useNavigate } from "react-router-dom";
import { Popconfirm, message } from "antd";
import { useGetCandidateResumesQuery, useDeleteCandidateResumeMutation, useUpdateCandidateResumeMutation } from "@/apis/resumeApi";
import Loading from "@/components/Loading";
import { RESUME_TYPES } from "@/constant";
import { CV_TEMPLATES } from "../../template-selection";


const ResumeBuilderTab = () => {
  const navigate = useNavigate();
  const { data: builderResumes = [], isLoading } = useGetCandidateResumesQuery(
    { type: RESUME_TYPES.TEMPLATE }
  );
  const [deleteResume] = useDeleteCandidateResumeMutation();
  const [updateCandidateResume] = useUpdateCandidateResumeMutation();

  const [editingId, setEditingId] = React.useState(null);
  const [editName, setEditName] = React.useState("");

  const handleStartEdit = (e, resumeId, displayTitle) => {
    e.stopPropagation();
    setEditingId(resumeId);
    setEditName(displayTitle);
  };

  const handleSaveEdit = async (e, resumeId, templateId) => {
    e.stopPropagation();
    if (!editName.trim()) {
      setEditingId(null);
      return;
    }

    try {
      await updateCandidateResume({
        resumeId,
        payload: {
          resumeName: `[${templateId}] ${editName.trim()}`,
          fileName: `[${templateId}] ${editName.trim()}.pdf`,
        }
      }).unwrap();
      message.success("Đổi tên CV thành công!");
    } catch (error) {
      message.error("Có lỗi xảy ra khi đổi tên CV.");
    } finally {
      setEditingId(null);
    }
  };

  const handleDelete = async (e, resumeId) => {
    e.stopPropagation();
    try {
      await deleteResume({ resumeId }).unwrap();
      message.success("Deleted successfully.");
    } catch (error) {
      message.error("Failed to delete. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <section>
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loading size={110} className="py-0" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {/* Create New Card */}
            <div
              onClick={() => navigate('/dashboard/resumes/templates')}
              className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center h-[480px] cursor-pointer hover:border-primary hover:bg-orange-50/50 dark:hover:bg-gray-700/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-gray-700 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-icons-round text-[24px] text-primary group-hover:text-white">add</span>
              </div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Create New</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Start from scratch</p>
            </div>

            {/* Existing CV Cards */}
            {builderResumes.map((resume) => {
              const nameRaw = resume.resumeName || resume.fileName || resume.fullName || `Resume #${resume.id}`;
              const match = nameRaw.match(/^\[(tpl_[a-z0-9_]+)\]\s*(.*)$/);
              const templateId = match ? match[1] : (resume.template || 'tpl_modern_1');
              const displayTitle = match ? (match[2] || `Resume #${resume.id}`) : nameRaw;
              const templateObj = CV_TEMPLATES.find(t => t.id === templateId) || CV_TEMPLATES[0];

              return (
                <div
                  key={resume.id}
                  onClick={() => {
                    navigate(`/dashboard/resumes/builder?template=${templateId}&resumeId=${resume.id}`);
                  }}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark flex flex-col cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all group relative overflow-hidden"
                >
                  {/* Delete button */}
                  <Popconfirm
                    title="Delete this resume?"
                    description="Are you sure you want to delete this resume?"
                    onConfirm={(e) => handleDelete(e, resume.id)}
                    onCancel={(e) => e?.stopPropagation()}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                  >
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                      <span className="material-icons-round text-[16px]">close</span>
                    </button>
                  </Popconfirm>

                  {/* CV Preview Skeleton & Hover Overlay */}
                  <div className={`flex-1 ${templateObj.bgColor || 'bg-gray-50'} dark:bg-gray-800/50 p-4 flex items-center justify-center relative`}>
                    {templateObj.preview ? (
                      <img
                        src={templateObj.preview}
                        alt={templateObj.name}
                        className="max-h-full max-w-full object-contain rounded shadow-sm border border-gray-100 dark:border-gray-600"
                      />
                    ) : (
                      <div className="w-full max-w-[120px] bg-white dark:bg-gray-700 rounded shadow-sm border border-gray-100 dark:border-gray-600 aspect-[3/4] flex items-center justify-center">
                        <span className="material-icons-round text-gray-300 text-[32px]">description</span>
                      </div>
                    )}
                    {/* Hover overlay that only covers the preview area */}
                    <div className="absolute inset-0 bg-gray-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px] z-10 pointer-events-none">
                      <span className="bg-white text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow flex items-center gap-1.5">
                        <span className="material-icons-round text-[14px]">edit</span>
                        Edit Resume
                      </span>
                    </div>
                  </div>

                  {/* Name and Rename/Edit icons */}
                  <div className="px-3 py-2.5 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between gap-2 overflow-hidden">
                      {editingId === resume.id ? (
                        <input
                          type="text"
                          value={editName}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(e, resume.id, templateId);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          onBlur={(e) => handleSaveEdit(e, resume.id, templateId)}
                          className="flex-1 w-full text-sm font-semibold text-gray-900 border border-primary/50 px-1 py-0.5 rounded outline-none w-0"
                        />
                      ) : (
                        <p className="font-semibold text-sm text-gray-900 dark:text-white truncate flex-1" title={displayTitle}>
                          {displayTitle}
                        </p>
                      )}
                      {editingId !== resume.id && (
                        <div className="flex items-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                          <button
                            onClick={(e) => handleStartEdit(e, resume.id, displayTitle)}
                            className="p-1 text-gray-400 hover:text-primary transition-colors cursor-pointer rounded-md hover:bg-gray-100"
                            title="Rename"
                          >
                            <span className="material-icons-round text-[14px]">edit_note</span>
                          </button>
                        </div>
                      )}
                    </div>
                    {(resume.updatedAt || resume.createdAt) && (
                      <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(resume.updatedAt || resume.createdAt)}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ResumeBuilderTab;
