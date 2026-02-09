import React, { useMemo, useState } from "react";
import { Popconfirm, message } from "antd";
import { useCandidateDashboardProfileQuery } from "@/apis/candidateApi";
import {
  useCreateResumeSkillMutation,
  useDeleteResumeSkillMutation,
  useUpdateResumeSkillMutation,
} from "@/apis/resumeApi";
import SkillFormModal from "@/pages/dashboard/profile/skills/SkillFormModal";
import { formatYearsOfExperience } from "@/utils/profileUtils";

const Skills = () => {
  const { data: profile } = useCandidateDashboardProfileQuery();
  const profileResumeId = profile?.profileResumeId;
  const skillGroups = useMemo(
    () => (profile?.skillGroups ?? []).filter((group) => (group?.skills ?? []).length > 0),
    [profile?.skillGroups]
  );

  const [editingGroup, setEditingGroup] = useState(null);
  const [modalInitialValues, setModalInitialValues] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [createSkill, { isLoading: isCreating }] = useCreateResumeSkillMutation();
  const [updateSkill, { isLoading: isUpdating }] = useUpdateResumeSkillMutation();
  const [deleteSkill, { isLoading: isDeleting }] = useDeleteResumeSkillMutation();
  const isSaving = isCreating || isUpdating || isDeleting;

  const openCreateModal = () => {
    setEditingGroup(null);
    setModalInitialValues(null);
    setIsModalOpen(true);
  };

  const openEditModal = (group) => {
    setEditingGroup(group);
    // Snapshot initial values so the modal won't "reset" while we patch profile cache during saves.
    setModalInitialValues({
      groupId: group?.id,
      groupName: group?.name,
      skills: [...(group?.skills ?? [])],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingGroup(null);
    setModalInitialValues(null);
  };

  const handleSubmit = async ({ groupName, entries }) => {
    if (!profileResumeId) {
      message.error("No PROFILE resume found.");
      return;
    }

    try {
      if (editingGroup?.id) {
        const currentSkills = editingGroup?.skills ?? [];
        const currentBySkillId = new Map(currentSkills.map((item) => [item?.skillId, item]));
        const nextBySkillId = new Map(entries.map((item) => [item?.skillId, item]));

        const ops = [];

        // Deletes (skills removed from group).
        for (const existing of currentSkills) {
          if (!existing?.skillId || !existing?.id) continue;
          if (!nextBySkillId.has(existing.skillId)) {
            ops.push(
              deleteSkill({
                resumeId: profileResumeId,
                resumeSkillId: existing.id,
              }).unwrap()
            );
          }
        }

        // Updates + creates.
        for (const next of entries) {
          if (!next?.skillId) continue;
          const existing = currentBySkillId.get(next.skillId);
          if (existing?.id) {
            ops.push(
              updateSkill({
                resumeId: profileResumeId,
                resumeSkillId: existing.id,
                payload: {
                  skillId: next.skillId,
                  yearsOfExperience: next.yearsOfExperience,
                  groupName,
                },
              }).unwrap()
            );
          } else {
            ops.push(
              createSkill({
                resumeId: profileResumeId,
                payload: {
                  skillId: next.skillId,
                  yearsOfExperience: next.yearsOfExperience,
                  groupName,
                },
              }).unwrap()
            );
          }
        }

        await Promise.all(ops);
        message.success("Skill group updated successfully.");
      } else {
        await Promise.all(
          entries.map((entry) =>
            createSkill({
              resumeId: profileResumeId,
              payload: {
                skillId: entry.skillId,
                yearsOfExperience: entry.yearsOfExperience,
                groupName,
              },
            }).unwrap()
          )
        );
        message.success("Skill group added successfully.");
      }

      closeModal();
    } catch (error) {
      message.error(error?.data?.message || "Failed to save skill group.");
    }
  };

  const handleDeleteGroup = async (group) => {
    if (!profileResumeId) {
      message.error("No PROFILE resume found.");
      return;
    }
    const skills = group?.skills ?? [];
    if (skills.length === 0) return;

    try {
      await Promise.all(
        skills
          .filter((skill) => !!skill?.id)
          .map((skill) =>
            deleteSkill({
              resumeId: profileResumeId,
              resumeSkillId: skill.id,
            }).unwrap()
          )
      );
      message.success("Skill group deleted successfully.");
    } catch (error) {
      message.error(error?.data?.message || "Failed to delete skill group.");
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
          Add Group
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillGroups.length === 0 ? (
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
              Add Group
            </button>
          </div>
        ) : (
          skillGroups.map((group) => (
            <div key={group?.id || group?.name}>
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> {group?.name || "Ungrouped"}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(group)}
                    className="text-gray-400 hover:text-primary transition-colors"
                    title="Edit group"
                  >
                    <span className="material-icons-round text-[18px]">edit</span>
                  </button>
                  <Popconfirm
                    title="Delete this group?"
                    description="This will remove all skills inside the group."
                    okText="Delete"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => handleDeleteGroup(group)}
                  >
                    <button
                      type="button"
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete group"
                    >
                      <span className="material-icons-round text-[18px]">delete</span>
                    </button>
                  </Popconfirm>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(group?.skills ?? []).map((skill) => (
                  <span
                    key={skill?.id}
                    className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm flex items-baseline gap-2"
                  >
                    <span className="font-semibold leading-none">{skill?.skillName || "Unknown Skill"}</span>
                    {skill?.yearsOfExperience != null ? (
                      <span className="text-gray-500 leading-none">({formatYearsOfExperience(skill.yearsOfExperience)})</span>
                    ) : null}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <SkillFormModal
        open={isModalOpen}
        mode={editingGroup?.id ? "edit" : "create"}
        initialValues={
          modalInitialValues
        }
        loading={isSaving}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Skills;
