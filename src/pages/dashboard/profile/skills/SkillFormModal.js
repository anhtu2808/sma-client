import React, { useEffect, useMemo, useState } from "react";
import { Form, Select, message } from "antd";
import ProfileSectionModal from "@/components/ProfileSectionModal";
import { useGetSkillsQuery } from "@/apis/skillApi";
import { formatYearsOfExperience } from "@/utils/profileUtils";
import Button from "@/components/Button";

const FORM_ID = "skill-form";

const YEARS_OPTIONS = Array.from({ length: 21 }, (_, value) => ({
  value,
  label: formatYearsOfExperience(value),
}));

const SkillFormModal = ({
  open,
  isEdit = false,
  initialValues,
  loading = false,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [pendingSkills, setPendingSkills] = useState([]);

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

    if (initialValues?.skillId && initialValues?.skillName) {
      const exists = mapped.some((item) => item.value === initialValues.skillId);
      if (!exists) {
        mapped.unshift({
          value: initialValues.skillId,
          label: initialValues.skillName,
        });
      }
    }

    return mapped;
  }, [initialValues?.skillId, initialValues?.skillName, skillOptionsData]);

  useEffect(() => {
    if (!open) return;

    form.setFieldsValue({
      selectedSkillId: undefined,
      selectedYearsOfExperience: undefined,
    });
    setSearchText("");
    setDebouncedSearchText("");

    if (isEdit && initialValues?.skillId) {
      setPendingSkills([
        {
          skillId: initialValues.skillId,
          skillName: initialValues.skillName || "Unknown Skill",
          yearsOfExperience: initialValues.yearsOfExperience ?? 0,
        },
      ]);
    } else {
      setPendingSkills([]);
    }
  }, [form, initialValues, isEdit, open]);

  const addPendingSkill = () => {
    const selectedSkillId = form.getFieldValue("selectedSkillId");
    const selectedYearsOfExperience = form.getFieldValue("selectedYearsOfExperience");

    if (!selectedSkillId || selectedYearsOfExperience == null) {
      message.error("Please select skill and experience.");
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
      if (isEdit) return [entry];
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
    if (pendingSkills.length === 0) {
      message.error("Please add at least one skill.");
      return;
    }
    onSubmit({ entries: pendingSkills });
  };

  return (
    <ProfileSectionModal
      open={open}
      title={isEdit ? "Update Skill" : "Add Skills"}
      onCancel={onCancel}
      loading={loading}
      formId={FORM_ID}
      width={980}
    >
      <Form id={FORM_ID} form={form} layout="vertical" onFinish={submitForm}>
        <div className="rounded-lg bg-gray-50 border border-gray-100 p-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_260px_auto] gap-3 items-start">
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-gray-50 text-base text-gray-800"
            >
              <span className="font-semibold">{item.skillName}</span>
              <span>({formatYearsOfExperience(item.yearsOfExperience)})</span>
              <button
                type="button"
                className="text-gray-500 hover:text-red-500"
                onClick={() => removePendingSkill(item.skillId)}
                title="Remove"
              >
                <span className="material-icons-round text-[18px]">close</span>
              </button>
            </span>
          ))}
        </div>
      </Form>
    </ProfileSectionModal>
  );
};

export default SkillFormModal;
