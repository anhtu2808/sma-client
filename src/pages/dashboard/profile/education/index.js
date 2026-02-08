import React, { useMemo, useState } from "react";
import { message } from "antd";
import { useCandidateDashboardProfileQuery } from "@/apis/candidateApi";
import {
  useCreateResumeEducationMutation,
  useUpdateResumeEducationMutation,
} from "@/apis/resumeApi";
import { enumToLabel, formatRange, toMonthInputValue } from "@/utils/profileUtils";
import EducationFormModal from "@/pages/dashboard/profile/education/EducationFormModal";

const Education = () => {
  const { data: profile } = useCandidateDashboardProfileQuery();
  const profileResumeId = profile?.profileResumeId;
  const educations = profile?.educations ?? [];

  const [editingEducation, setEditingEducation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [createEducation, { isLoading: isCreating }] = useCreateResumeEducationMutation();
  const [updateEducation, { isLoading: isUpdating }] = useUpdateResumeEducationMutation();
  const isSaving = isCreating || isUpdating;

  const modalInitialValues = useMemo(() => {
    if (!editingEducation) return null;
    return {
      institution: editingEducation?.institution ?? "",
      degree: editingEducation?.degree ?? undefined,
      majorField: editingEducation?.majorField ?? "",
      gpa: editingEducation?.gpa ?? "",
      startMonth: toMonthInputValue(editingEducation?.startDate),
      endMonth: toMonthInputValue(editingEducation?.endDate),
      isCurrent: !!editingEducation?.isCurrent,
    };
  }, [editingEducation]);

  const openCreateModal = () => {
    setEditingEducation(null);
    setIsModalOpen(true);
  };

  const openEditModal = (education) => {
    setEditingEducation(education);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingEducation(null);
  };

  const handleSubmit = async (payload) => {
    if (!profileResumeId) {
      message.error("No PROFILE resume found.");
      return;
    }

    try {
      if (editingEducation?.id) {
        await updateEducation({
          resumeId: profileResumeId,
          educationId: editingEducation.id,
          payload,
        }).unwrap();
        message.success("Education updated successfully.");
      } else {
        await createEducation({ resumeId: profileResumeId, payload }).unwrap();
        message.success("Education added successfully.");
      }

      closeModal();
    } catch (error) {
      message.error(error?.data?.message || "Failed to save education.");
    }
  };

  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg text-primary">
            <span className="material-icons-round">school</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Education</h2>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
        >
          <span className="material-icons-round text-[18px] border border-current rounded-full p-[1px]">
            add
          </span>
          Add Education
        </button>
      </div>

      <div className="p-6 space-y-6">
        {educations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-primary/40 bg-primary/[0.04] p-5">
            <p className="text-sm italic text-gray-500 dark:text-gray-400 mb-3">
              Add your academic background and relevant qualifications.
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              <span className="material-icons-round text-[18px] border border-current rounded-full p-[1px]">
                add
              </span>
              Add Education
            </button>
          </div>
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
                      {[enumToLabel(education?.degree), education?.majorField].filter(Boolean).join(" - ") || "N/A"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatRange(education?.startDate, education?.endDate, education?.isCurrent)}
                    </span>
                    <button
                      type="button"
                      onClick={() => openEditModal(education)}
                      className="text-gray-400 hover:text-primary transition-colors"
                      title="Edit"
                    >
                      <span className="material-icons-round text-[18px]">edit</span>
                    </button>
                  </div>
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

      <EducationFormModal
        open={isModalOpen}
        isEdit={!!editingEducation}
        initialValues={modalInitialValues}
        loading={isSaving}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Education;
