import React, { useMemo, useState } from "react";
import { message } from "antd";
import { useCandidateDashboardProfileQuery } from "@/apis/candidateApi";
import {
  useCreateResumeProjectMutation,
  useUpdateResumeProjectMutation,
} from "@/apis/resumeApi";
import {
  enumToLabel,
  formatRange,
  getValidLink,
  toMonthInputValue,
} from "@/utils/profileUtils";
import ProjectFormModal from "@/pages/dashboard/profile/projects/ProjectFormModal";

const Projects = () => {
  const { data: profile } = useCandidateDashboardProfileQuery();
  const profileResumeId = profile?.profileResumeId;
  const projects = useMemo(() => profile?.projects ?? [], [profile?.projects]);

  const [editingProject, setEditingProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [createProject, { isLoading: isCreating }] = useCreateResumeProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateResumeProjectMutation();
  const isSaving = isCreating || isUpdating;

  const openCreateModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = async (payload) => {
    if (!profileResumeId) {
      message.error("No PROFILE resume found.");
      return;
    }

    try {
      if (editingProject?.id) {
        await updateProject({
          resumeId: profileResumeId,
          projectId: editingProject.id,
          payload,
        }).unwrap();
        message.success("Project updated successfully.");
      } else {
        await createProject({ resumeId: profileResumeId, payload }).unwrap();
        message.success("Project added successfully.");
      }

      closeModal();
    } catch (error) {
      message.error(error?.data?.message || "Failed to save project.");
    }
  };

  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg text-primary">
            <span className="material-icons-round">rocket_launch</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Projects</h2>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
        >
          <span className="material-icons-round text-[18px] border border-current rounded-full p-[1px]">
            add
          </span>
          Add Project
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.length === 0 ? (
          <div className="md:col-span-2 rounded-xl border border-dashed border-primary/40 bg-primary/[0.04] p-5">
            <p className="text-sm italic text-gray-500 dark:text-gray-400 mb-3">
              Add your highlight projects so recruiters can quickly understand your hands-on impact.
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              <span className="material-icons-round text-[18px] border border-current rounded-full p-[1px]">
                add
              </span>
              Add Project
            </button>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project?.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary/50 transition-colors group"
            >
              <div className="flex justify-between items-start mb-2 gap-3">
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                  {project?.title || "N/A"}
                </h3>
                <div className="flex items-center gap-1">
                  {project?.projectUrl ? (
                    <a
                      className="text-gray-500 hover:text-primary transition-colors"
                      href={getValidLink(project.projectUrl)}
                      target="_blank"
                      rel="noreferrer"
                      title="Open Project URL"
                    >
                      <span className="material-icons-round text-[18px]">open_in_new</span>
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => openEditModal(project)}
                    className="text-gray-400 hover:text-primary transition-colors"
                    title="Edit"
                  >
                    <span className="material-icons-round text-[18px]">edit</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                {project?.description || "N/A"}
              </p>

              {(project?.position || project?.teamSize) && (
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {project?.position ? (
                    <span className="text-xs px-2 py-1 rounded bg-orange-50 text-orange-700">
                      Role: {project.position}
                    </span>
                  ) : null}
                  {project?.teamSize ? (
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                      Team size: {project.teamSize}
                    </span>
                  ) : null}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-primary bg-primary/5 px-2 py-1 rounded">
                  {formatRange(project?.startDate, project?.endDate, project?.isCurrent)}
                </span>
                {project?.projectType ? (
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                    {enumToLabel(project?.projectType)}
                  </span>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>

      <ProjectFormModal
        open={isModalOpen}
        isEdit={!!editingProject}
        initialValues={
          editingProject
            ? {
                title: editingProject?.title ?? "",
                position: editingProject?.position ?? "",
                teamSize: editingProject?.teamSize ?? "",
                projectType: editingProject?.projectType ?? undefined,
                projectUrl: editingProject?.projectUrl ?? "",
                description: editingProject?.description ?? "",
                startMonth: toMonthInputValue(editingProject?.startDate),
                endMonth: toMonthInputValue(editingProject?.endDate),
                isCurrent: !!editingProject?.isCurrent,
              }
            : null
        }
        loading={isSaving}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Projects;
