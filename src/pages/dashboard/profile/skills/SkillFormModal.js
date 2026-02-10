import React, { useEffect, useMemo, useRef, useState } from "react";
import { Form, Input, Select, message } from "antd";
import ProfileSectionModal from "@/components/ProfileSectionModal";
import { useGetSkillsQuery } from "@/apis/skillApi";
import { formatYearsOfExperience } from "@/utils/profileUtils";
import Button from "@/components/Button";

const FORM_ID = "skill-form";
const MAX_SKILLS_PER_GROUP = 20;

const YEARS_OPTIONS = Array.from({ length: 21 }, (_, value) => ({
  value,
  label: formatYearsOfExperience(value),
}));

const SkillFormModal = ({
  open,
  initialValues,
  mode = "create", // "create" | "edit"
  loading = false,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [pendingSkills, setPendingSkills] = useState([]);
  const didInitRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [searchText]);

  const { data: skillOptionsData = [], isFetching: isLoadingSkills } = useGetSkillsQuery({
    name: debouncedSearchText || undefined,
    page: 0,
    size: 30,
  });

  const skillOptions = useMemo(() => {
    const mapped = skillOptionsData.map((skill) => ({
      value: skill?.id,
      label: skill?.name,
    }));

    const initialSkillItems = initialValues?.skills ?? [];
    for (const item of initialSkillItems) {
      if (!item?.skillId || !item?.skillName) continue;
      const exists = mapped.some((option) => option.value === item.skillId);
      if (!exists) {
        mapped.unshift({ value: item.skillId, label: item.skillName });
      }
    }

    return mapped;
  }, [initialValues?.skills, skillOptionsData]);

  useEffect(() => {
    if (!open) {
      didInitRef.current = false;
      return;
    }
    if (didInitRef.current) {
      return;
    }
    didInitRef.current = true;

    if (!open) return;

    form.setFieldsValue({
      groupName: "",
      selectedSkillId: undefined,
      selectedYearsOfExperience: undefined,
    });
    setSearchText("");
    setDebouncedSearchText("");

    if (mode === "edit" && initialValues?.groupName) {
      form.setFieldValue("groupName", initialValues.groupName);
      setPendingSkills(
        (initialValues?.skills ?? []).map((skill) => ({
          resumeSkillId: skill?.id ?? null,
          skillId: skill?.skillId,
          skillName: skill?.skillName || "Unknown Skill",
          yearsOfExperience: skill?.yearsOfExperience ?? null,
        }))
      );
    } else {
      setPendingSkills([]);
    }
  }, [form, initialValues, mode, open]);

  const addPendingSkill = () => {
    const groupName = `${form.getFieldValue("groupName") ?? ""}`.trim().replace(/\s+/g, " ");
    const selectedSkillId = form.getFieldValue("selectedSkillId");
    const selectedYearsOfExperience = form.getFieldValue("selectedYearsOfExperience");

    if (!groupName) {
      message.error("Please enter group name.");
      return;
    }
    if (!selectedSkillId || selectedYearsOfExperience == null) {
      message.error("Please select skill and experience.");
      return;
    }
    if (pendingSkills.length >= MAX_SKILLS_PER_GROUP) {
      message.error(`Maximum ${MAX_SKILLS_PER_GROUP} skills per group.`);
      return;
    }

    const selectedOption = skillOptions.find((option) => option.value === selectedSkillId);
    const skillName = selectedOption?.label || "Unknown Skill";
    const entry = {
      skillId: selectedSkillId,
      skillName,
      yearsOfExperience: Number(selectedYearsOfExperience),
    };

    setPendingSkills((prev) => {
      const existing = prev.find((item) => item.skillId === entry.skillId);
      if (!existing) return [...prev, entry];
      return prev.map((item) => (item.skillId === entry.skillId ? entry : item));
    });

    form.setFieldsValue({
      selectedSkillId: undefined,
      selectedYearsOfExperience: undefined,
    });
  };

  const removePendingSkill = (skillId) => {
    setPendingSkills((prev) => prev.filter((item) => item.skillId !== skillId));
  };

  const submitForm = () => {
    const groupName = `${form.getFieldValue("groupName") ?? ""}`.trim().replace(/\s+/g, " ");
    if (!groupName) {
      message.error("Please enter group name.");
      return;
    }
    if (pendingSkills.length === 0) {
      message.error("Please add at least one skill.");
      return;
    }
    onSubmit({ groupName, entries: pendingSkills });
  };

  return (
    <ProfileSectionModal
      open={open}
      title={mode === "edit" ? "Edit Skill Group" : "Add Skill Group"}
      onCancel={onCancel}
      loading={loading}
      formId={FORM_ID}
      width={980}
    >
      <Form id={FORM_ID} form={form} layout="vertical" onFinish={submitForm}>
        <div className="rounded-lg bg-orange-50 border border-orange-100 p-4 mb-4">
          <div className="flex items-start gap-3">
            <span className="material-icons-round text-primary mt-[2px]">lightbulb</span>
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Tips:</span> Organize your skills into groups to help recruiters scan faster.
            </div>
          </div>
        </div>

        <Form.Item
          label={
            <span>
              Group name <span className="text-red-500">*</span>
            </span>
          }
          name="groupName"
          rules={[{ required: true, message: "Group name is required." }]}
        >
          <Input size="large" placeholder="Core Skills" maxLength={80} />
        </Form.Item>

        <div className="text-sm font-semibold text-gray-800 mb-2">
          List skills ({pendingSkills.length}/{MAX_SKILLS_PER_GROUP})
        </div>
        <div className="rounded-lg bg-gray-50 border border-gray-100 p-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-3 items-start">
            <Form.Item name="selectedSkillId" className="!mb-0">
              <Select
                size="large"
                showSearch
                placeholder="Search skills"
                options={skillOptions}
                loading={isLoadingSkills}
                filterOption={false}
                onSearch={setSearchText}
              />
            </Form.Item>

            <Form.Item name="selectedYearsOfExperience" className="!mb-0">
              <Select
                size="large"
                placeholder="Select experience"
                options={YEARS_OPTIONS}
              />
            </Form.Item>

            <Button
              type="button"
              onClick={addPendingSkill}
              shape="rounded"
              title="Add skill"
              btnIcon
            >
              {<span className="material-icons-round">add</span>}
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {pendingSkills.map((item) => (
            <span
              key={item.skillId}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-300 bg-gray-50 text-sm text-gray-800"
            >
              <span className="font-medium">{item.skillName}</span>
              {item.yearsOfExperience != null ? (
                <span>({formatYearsOfExperience(item.yearsOfExperience)})</span>
              ) : null}
              <button
                type="button"
                className="text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors"
                onClick={() => removePendingSkill(item.skillId)}
                title="Remove"
              >
                <span className="material-icons-round text-[16px]">close</span>
              </button>
            </span>
          ))}
        </div>
      </Form>
    </ProfileSectionModal>
  );
};

export default SkillFormModal;
