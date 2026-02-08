import React, { useMemo, useState } from "react";
import { message } from "antd";
import { useCandidateDashboardProfileQuery } from "@/apis/candidateApi";
import {
  useCreateResumeSkillMutation,
  useUpdateResumeSkillMutation,
} from "@/apis/resumeApi";
import SkillFormModal from "@/pages/dashboard/profile/skills/SkillFormModal";
import { formatYearsOfExperience } from "@/utils/profileUtils";

const Skills = () => {
  const { data: profile } = useCandidateDashboardProfileQuery();
  const profileResumeId = profile?.profileResumeId;
  const skills = useMemo(() => profile?.skills ?? [], [profile?.skills]);

  const [editingSkill, setEditingSkill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [createSkill, { isLoading: isCreating }] = useCreateResumeSkillMutation();
  const [updateSkill, { isLoading: isUpdating }] = useUpdateResumeSkillMutation();
  const isSaving = isCreating || isUpdating;

  const groupedSkills = useMemo(
    () =>
      skills.reduce((acc, skill) => {
        const key = skill?.skillCategoryName || "Other";
        if (!acc[key]) acc[key] = [];
        acc[key].push(skill);
        return acc;
      }, {}),
    [skills]
  );

  const openCreateModal = () => {
    setEditingSkill(null);
    setIsModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingSkill(null);
  };

  const handleSubmit = async ({ entries }) => {
    if (!profileResumeId) {
      message.error("No PROFILE resume found.");
      return;
    }

    try {
      if (editingSkill?.id) {
        const target = entries?.[0];
        if (!target) {
          message.error("Please add one skill before saving.");
          return;
        }

        await updateSkill({
          resumeId: profileResumeId,
          resumeSkillId: editingSkill.id,
          payload: {
            skillId: target.skillId,
            yearsOfExperience: target.yearsOfExperience,
          },
        }).unwrap();
        message.success("Skill updated successfully.");
      } else {
        for (const entry of entries) {
          await createSkill({
            resumeId: profileResumeId,
            payload: {
              skillId: entry.skillId,
              yearsOfExperience: entry.yearsOfExperience,
            },
          }).unwrap();
        }
        message.success("Skills added successfully.");
      }

      closeModal();
    } catch (error) {
      message.error(error?.data?.message || "Failed to save skill.");
    }
  };

  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg text-primary">
            <span className="material-icons-round">psychology</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Skills</h2>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
        >
          <span className="material-icons-round text-[18px] border border-current rounded-full p-[1px]">
            add
          </span>
          Add Skill
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(groupedSkills).length === 0 ? (
          <div className="md:col-span-2 rounded-xl border border-dashed border-primary/40 bg-primary/[0.04] p-5">
            <p className="text-sm italic text-gray-500 dark:text-gray-400 mb-3">
              List skills that align with your target roles and domain expertise.
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              <span className="material-icons-round text-[18px] border border-current rounded-full p-[1px]">
                add
              </span>
              Add Skill
            </button>
          </div>
        ) : (
          Object.entries(groupedSkills).map(([categoryName, categorySkills]) => (
            <div key={categoryName}>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> {categoryName}
              </h3>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill) => (
                  <button
                    type="button"
                    key={skill?.id}
                    onClick={() => openEditModal(skill)}
                    className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm flex items-center gap-2 hover:border-primary/40 transition-colors"
                  >
                    <span className="font-semibold">{skill?.skillName || "Unknown Skill"}</span>
                    <span className="text-gray-500">({formatYearsOfExperience(skill?.yearsOfExperience)})</span>
                    <span className="material-icons-round text-[14px] text-gray-400">edit</span>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <SkillFormModal
        open={isModalOpen}
        isEdit={!!editingSkill}
        initialValues={
          editingSkill
            ? {
                id: editingSkill?.id,
                skillId: editingSkill?.skillId,
                skillName: editingSkill?.skillName,
                yearsOfExperience: editingSkill?.yearsOfExperience,
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

export default Skills;
