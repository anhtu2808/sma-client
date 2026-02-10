import React, { useEffect, useMemo } from "react";
import { Checkbox, DatePicker, Form, Input, Select } from "antd";
import dayjs from "dayjs";
import ProfileSectionModal from "@/components/ProfileSectionModal";

const FORM_ID = "project-form";

const ProjectFormModal = ({
  open,
  isEdit = false,
  initialValues,
  loading = false,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const projectTypeOptions = useMemo(
    () => [
      { value: "PERSONAL", label: "Personal" },
      { value: "ACADEMIC", label: "Academic" },
      { value: "PROFESSIONAL", label: "Professional" },
      { value: "OPEN_SOURCE", label: "Open Source" },
      { value: "FREELANCE", label: "Freelance" },
    ],
    []
  );

  useEffect(() => {
    if (!open) return;
    const merged = {
      title: "",
      position: "",
      teamSize: "",
      projectType: undefined,
      projectUrl: "",
      description: "",
      startMonth: null,
      endMonth: null,
      isCurrent: false,
      ...initialValues,
    };

    merged.startMonth = merged.startMonth ? dayjs(merged.startMonth) : null;
    merged.endMonth = merged.endMonth ? dayjs(merged.endMonth) : null;

    form.setFieldsValue(merged);
  }, [form, initialValues, open]);

  const handleFinish = (values) => {
    onSubmit({
      title: values.title?.trim() || null,
      teamSize: values.teamSize === "" || values.teamSize == null ? null : Number(values.teamSize),
      position: values.position?.trim() || null,
      description: values.description?.trim() || null,
      projectType: values.projectType || null,
      startDate: values.startMonth ? values.startMonth.format("YYYY-MM-01") : null,
      endDate:
        values.isCurrent || !values.endMonth ? null : values.endMonth.format("YYYY-MM-01"),
      isCurrent: !!values.isCurrent,
      projectUrl: values.projectUrl?.trim() || null,
    });
  };

  return (
    <ProfileSectionModal
      open={open}
      title={isEdit ? "Update Project" : "Add Project"}
      onCancel={onCancel}
      loading={loading}
      formId={FORM_ID}
      width={860}
    >
      <Form id={FORM_ID} form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Project Name"
          name="title"
          rules={[{ required: true, message: "Please enter your project name." }]}
        >
          <Input size="large" placeholder="Smart Recruit Portal" />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item label="Role" name="position">
            <Input size="large" placeholder="Frontend Developer" />
          </Form.Item>

          <Form.Item label="Project Type" name="projectType">
            <Select size="large" placeholder="Select project type" options={projectTypeOptions} />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item label="Team Size" name="teamSize">
            <Input size="large" type="number" min="1" placeholder="5" />
          </Form.Item>

          <Form.Item label="Project URL" name="projectUrl">
            <Input size="large" placeholder="https://..." />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="From"
            name="startMonth"
            rules={[{ required: true, message: "Please select a start date." }]}
          >
            <DatePicker
              picker="month"
              size="large"
              className="w-full"
              format="MM/YYYY"
              placeholder="Select month"
            />
          </Form.Item>

          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) => (
              <Form.Item
                label="To"
                name="endMonth"
                rules={
                  getFieldValue("isCurrent")
                    ? []
                    : [{ required: true, message: "Please select an end date." }]
                }
              >
                <DatePicker
                  picker="month"
                  size="large"
                  className="w-full"
                  format="MM/YYYY"
                  placeholder="Select month"
                  disabled={getFieldValue("isCurrent")}
                />
              </Form.Item>
            )}
          </Form.Item>
        </div>

        <Form.Item name="isCurrent" valuePropName="checked">
          <Checkbox>I am currently working on this project</Checkbox>
        </Form.Item>

        <Form.Item label="Project Description" name="description">
          <Input.TextArea rows={5} showCount maxLength={5000} placeholder="Describe your project scope and impact..." />
        </Form.Item>
      </Form>
    </ProfileSectionModal>
  );
};

export default ProjectFormModal;
