import React, { useEffect } from "react";
import { Checkbox, DatePicker, Form, Input, Select } from "antd";
import dayjs from "dayjs";
import ProfileSectionModal from "@/components/ProfileSectionModal";

const FORM_ID = "experience-form";

const emptyRole = {
  id: null,
  title: "",
  description: "",
  startMonth: null,
  endMonth: null,
  isCurrent: false,
};

const ExperienceFormModal = ({
  open,
  isEdit = false,
  initialValues,
  loading = false,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;
    const merged = {
      company: "",
      workingModel: undefined,
      employmentType: undefined,
      startMonth: null,
      endMonth: null,
      isCurrent: false,
      roles: [emptyRole],
      ...initialValues,
    };

    // Convert string dates to dayjs objects
    merged.startMonth = merged.startMonth ? dayjs(merged.startMonth) : null;
    merged.endMonth = merged.endMonth ? dayjs(merged.endMonth) : null;

    if (merged.roles && merged.roles.length > 0) {
      merged.roles = merged.roles.map((role) => ({
        ...role,
        startMonth: role.startMonth ? dayjs(role.startMonth) : null,
        endMonth: role.endMonth ? dayjs(role.endMonth) : null,
      }));
    } else {
      merged.roles = [emptyRole];
    }

    form.setFieldsValue(merged);
  }, [form, initialValues, open]);

  const handleFinish = (values) => {
    const experiencePayload = {
      company: values.company?.trim() || null,
      workingModel: values.workingModel || null,
      employmentType: values.employmentType || null,
      startDate: values.startMonth ? values.startMonth.format("YYYY-MM-01") : null,
      endDate: values.isCurrent || !values.endMonth ? null : values.endMonth.format("YYYY-MM-01"),
      isCurrent: !!values.isCurrent,
    };

    const details = (values.roles ?? [])
      .map((role) => ({
        id: role?.id ?? null,
        title: role?.title?.trim() || null,
        description: role?.description?.trim() || null,
        startDate: role?.startMonth ? role.startMonth.format("YYYY-MM-01") : null,
        endDate: role?.isCurrent || !role?.endMonth ? null : role.endMonth.format("YYYY-MM-01"),
        isCurrent: !!role?.isCurrent,
      }))
      .filter((role) =>
        Boolean(
          role.title ||
            role.description ||
            role.startDate ||
            role.endDate ||
            role.isCurrent
        )
      );

    onSubmit({
      experiencePayload,
      details,
    });
  };

  return (
    <ProfileSectionModal
      open={open}
      title={isEdit ? "Update Work Experience" : "Add Work Experience"}
      onCancel={onCancel}
      loading={loading}
      formId={FORM_ID}
      width={980}
    >
      <Form
        id={FORM_ID}
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item label="Working Model" name="workingModel">
            <Select
              size="large"
              placeholder="Select working model"
              options={[
                { value: "REMOTE", label: "Remote" },
                { value: "ONSITE", label: "Onsite" },
                { value: "HYBRID", label: "Hybrid" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Employment Type" name="employmentType">
            <Select
              size="large"
              placeholder="Select employment type"
              options={[
                { value: "FULL_TIME", label: "Full-time" },
                { value: "PART_TIME", label: "Part-time" },
                { value: "SELF_EMPLOYED", label: "Self-employed" },
                { value: "FREELANCE", label: "Freelance" },
                { value: "CONTRACT", label: "Contract" },
                { value: "INTERNSHIP", label: "Internship" },
                { value: "APPRENTICESHIP", label: "Apprenticeship" },
                { value: "SEASONAL", label: "Seasonal" },
              ]}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Company"
            name="company"
            rules={[{ required: true, message: "Please enter your company name." }]}
          >
            <Input size="large" placeholder="Company name" />
          </Form.Item>

          <Form.Item name="isCurrent" valuePropName="checked" className="md:pt-[30px]">
            <Checkbox>I currently work at this company</Checkbox>
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Company From"
            name="startMonth"
            rules={[{ required: true, message: "Please select a start date." }]}
          >
            <DatePicker picker="month" size="large" className="w-full" format="MM/YYYY" placeholder="Select month" />
          </Form.Item>

          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) => (
              <Form.Item
                label="Company To"
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

        <div className="mt-6 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-semibold text-gray-900">Roles at this company</h4>
            <button
              type="button"
              onClick={() => {
                const current = form.getFieldValue("roles") ?? [];
                form.setFieldValue("roles", [emptyRole, ...current]);
              }}
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              <span className="material-icons-round text-[18px] border border-current rounded-full p-[1px]">
                add
              </span>
              Add Role
            </button>
          </div>

          <Form.List name="roles">
            {(fields) => (
              <div className="space-y-4">
                {fields.map((field, idx) => (
                  <div key={field.key} className="rounded-lg border border-gray-200 p-4">
                    <Form.Item name={[field.name, "id"]} hidden>
                      <Input />
                    </Form.Item>

                    <div className="flex items-center justify-between mb-3">
                      <Form.Item shouldUpdate noStyle>
                        {({ getFieldValue }) => {
                          const roleId = getFieldValue(["roles", field.name, "id"]);
                          if (roleId) return null;
                          return (
                            <button
                              type="button"
                              onClick={() => {
                                const current = form.getFieldValue("roles") ?? [];
                                form.setFieldValue(
                                  "roles",
                                  current.filter((_, index) => index !== field.name)
                                );
                              }}
                              className="text-red-500 hover:text-red-600 text-sm"
                            >
                              Remove
                            </button>
                          );
                        }}
                      </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      <Form.Item
                        label="Job Title"
                        name={[field.name, "title"]}
                        rules={[{ required: true, message: "Please enter role title." }]}
                      >
                        <Input size="large" placeholder="Technical Lead" />
                      </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item label="From" name={[field.name, "startMonth"]}>
                        <DatePicker picker="month" size="large" className="w-full" format="MM/YYYY" placeholder="Select month" />
                      </Form.Item>

                      <Form.Item shouldUpdate noStyle>
                        {({ getFieldValue }) => (
                          <Form.Item label="To" name={[field.name, "endMonth"]}>
                            <DatePicker 
                              picker="month" 
                              size="large" 
                              className="w-full" 
                              format="MM/YYYY" 
                              placeholder="Select month"
                              disabled={getFieldValue(["roles", field.name, "isCurrent"])}
                            />
                          </Form.Item>
                        )}
                      </Form.Item>
                    </div>

                    <Form.Item name={[field.name, "isCurrent"]} valuePropName="checked">
                      <Checkbox>I currently hold this role</Checkbox>
                    </Form.Item>

                    <Form.Item label="Role Description" name={[field.name, "description"]} className="!mb-0">
                      <Input.TextArea
                        rows={4}
                        showCount
                        maxLength={5000}
                        placeholder="Describe key achievements and responsibilities for this role..."
                      />
                    </Form.Item>
                  </div>
                ))}
              </div>
            )}
          </Form.List>
        </div>
      </Form>
    </ProfileSectionModal>
  );
};

export default ExperienceFormModal;
