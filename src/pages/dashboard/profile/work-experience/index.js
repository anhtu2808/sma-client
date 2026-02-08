import React, { useMemo, useState } from "react";
import { message } from "antd";
import { useCandidateDashboardProfileQuery } from "@/apis/candidateApi";
import {
  useCreateResumeExperienceDetailMutation,
  useCreateResumeExperienceMutation,
  useUpdateResumeExperienceDetailMutation,
  useUpdateResumeExperienceMutation,
} from "@/apis/resumeApi";
import { formatRange, toMonthInputValue } from "@/utils/profileUtils";
import ExperienceFormModal from "@/pages/dashboard/profile/work-experience/ExperienceFormModal";

const sortByDateDesc = (items = []) => {
  return [...items].sort((a, b) => {
    const aDate = a?.startDate ? new Date(a.startDate).getTime() : 0;
    const bDate = b?.startDate ? new Date(b.startDate).getTime() : 0;
    return bDate - aDate;
  });
};

const WorkExperience = () => {
  const { data: profile } = useCandidateDashboardProfileQuery();
  const profileResumeId = profile?.profileResumeId;
  const experiences = useMemo(() => sortByDateDesc(profile?.experiences ?? []), [profile?.experiences]);

  const [editingExperience, setEditingExperience] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [createExperience, { isLoading: isCreatingExperience }] = useCreateResumeExperienceMutation();
  const [updateExperience, { isLoading: isUpdatingExperience }] = useUpdateResumeExperienceMutation();
  const [createExperienceDetail, { isLoading: isCreatingDetail }] = useCreateResumeExperienceDetailMutation();
  const [updateExperienceDetail, { isLoading: isUpdatingDetail }] = useUpdateResumeExperienceDetailMutation();
  const isSaving = isCreatingExperience || isUpdatingExperience || isCreatingDetail || isUpdatingDetail;

  const openCreateModal = () => {
    setEditingExperience(null);
    setIsModalOpen(true);
  };

  const openEditModal = (experience) => {
    setEditingExperience(experience);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingExperience(null);
  };

  const handleSubmit = async ({ experiencePayload, details }) => {
    if (!profileResumeId) {
      message.error("No PROFILE resume found.");
      return;
    }

    try {
      let savedExperience;
      if (editingExperience?.id) {
        savedExperience = await updateExperience({
          resumeId: profileResumeId,
          experienceId: editingExperience.id,
          payload: experiencePayload,
        }).unwrap();
      } else {
        savedExperience = await createExperience({
          resumeId: profileResumeId,
          payload: experiencePayload,
        }).unwrap();
      }

      const targetExperienceId = savedExperience?.id || editingExperience?.id;

      for (const detail of details) {
        const payload = {
          title: detail.title,
          position: detail.position,
          description: detail.description,
          startDate: detail.startDate,
          endDate: detail.endDate,
          isCurrent: detail.isCurrent,
        };

        if (detail.id) {
          await updateExperienceDetail({
            resumeId: profileResumeId,
            experienceDetailId: detail.id,
            payload,
          }).unwrap();
        } else {
          await createExperienceDetail({
            resumeId: profileResumeId,
            experienceId: targetExperienceId,
            payload,
          }).unwrap();
        }
      }

      message.success(editingExperience?.id ? "Work experience updated successfully." : "Work experience added successfully.");
      closeModal();
    } catch (error) {
      message.error(error?.data?.message || "Failed to save work experience.");
    }
  };

  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg text-primary">
            <span className="material-icons-round">work</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Work Experience</h2>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
        >
          <span className="material-icons-round text-[18px] border border-current rounded-full p-[1px]">
            add
          </span>
          Add Experience
        </button>
      </div>

      <div className="p-6 space-y-10">
        {experiences.length === 0 ? (
          <div className="rounded-xl border border-dashed border-primary/40 bg-primary/[0.04] p-5">
            <p className="text-sm italic text-gray-500 dark:text-gray-400 mb-3">
              Add your work experience to make your profile more convincing for recruiters.
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              <span className="material-icons-round text-[18px] border border-current rounded-full p-[1px]">
                add
              </span>
              Add Experience
            </button>
          </div>
        ) : (
          experiences.map((experience) => {
            const sortedDetails = sortByDateDesc(experience?.details ?? []);

            return (
              <div key={experience?.id} className="rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{experience?.company || "N/A"}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatRange(experience?.startDate, experience?.endDate, experience?.isCurrent)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openEditModal(experience)}
                    className="text-gray-400 hover:text-primary transition-colors"
                    title="Edit company experience"
                  >
                    <span className="material-icons-round text-[18px]">edit</span>
                  </button>
                </div>

                {sortedDetails.length === 0 ? (
                  <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/40 rounded-lg p-3">
                    No role history yet for this company.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {sortedDetails.map((detail, detailIndex) => (
                      <div key={detail?.id || detailIndex} className="relative pl-7">
                        <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-orange-500" />
                        {detailIndex < sortedDetails.length - 1 ? (
                          <div className="absolute left-[5px] top-5 bottom-[-18px] w-[2px] bg-orange-200" />
                        ) : null}

                        <h4 className="text-lg font-semibold text-gray-900">
                          {detail?.title || detail?.position || "Untitled role"}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {formatRange(detail?.startDate, detail?.endDate, detail?.isCurrent)}
                        </p>

                        {detail?.description ? (
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-6 mb-3">{detail.description}</p>
                        ) : null}

                        {detail?.skills?.length ? (
                          <div className="flex flex-wrap gap-2">
                            {detail.skills.map((skill) => (
                              <span
                                key={skill?.id}
                                className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs font-medium text-gray-500 dark:text-gray-300"
                              >
                                {skill?.skillName || skill?.description || "N/A"}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <ExperienceFormModal
        open={isModalOpen}
        isEdit={!!editingExperience}
        initialValues={
          editingExperience
            ? {
                company: editingExperience?.company ?? "",
                startMonth: toMonthInputValue(editingExperience?.startDate),
                endMonth: toMonthInputValue(editingExperience?.endDate),
                isCurrent: !!editingExperience?.isCurrent,
                roles: sortByDateDesc(editingExperience?.details ?? []).map((detail) => ({
                  id: detail?.id ?? null,
                  title: detail?.title ?? "",
                  position: detail?.position ?? "",
                  description: detail?.description ?? "",
                  startMonth: toMonthInputValue(detail?.startDate),
                  endMonth: toMonthInputValue(detail?.endDate),
                  isCurrent: !!detail?.isCurrent,
                })),
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

export default WorkExperience;
