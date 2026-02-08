import React, { useEffect, useMemo } from "react";
import { Checkbox, Form, Input, Select } from "antd";
import ProfileSectionModal from "@/components/ProfileSectionModal";
import { monthValueToApiDate } from "@/utils/profileUtils";

const FORM_ID = "education-form";

const EducationFormModal = ({
  open,
  isEdit = false,
  initialValues,
  loading = false,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const degreeOptions = useMemo(
    () => [
      { value: "HIGH_SCHOOL", label: "High School" },
      { value: "ASSOCIATE", label: "Associate" },
      { value: "BACHELOR", label: "Bachelor" },
      { value: "MASTER", label: "Master" },
      { value: "DOCTORATE", label: "Doctorate" },
      { value: "CERTIFICATE", label: "Certificate" },
    ],
    []
  );

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue({
      institution: "",
      degree: undefined,
      majorField: "",
      gpa: "",
      startMonth: "",
      endMonth: "",
      isCurrent: false,
      ...initialValues,
    });
  }, [form, initialValues, open]);

  const handleFinish = (values) => {
    onSubmit({
      institution: values.institution?.trim() || null,
      degree: values.degree || null,
      majorField: values.majorField?.trim() || null,
      gpa: values.gpa === "" || values.gpa == null ? null : Number(values.gpa),
      startDate: monthValueToApiDate(values.startMonth),
      endDate: values.isCurrent ? null : monthValueToApiDate(values.endMonth),
      isCurrent: !!values.isCurrent,
    });
  };

  return (
    <ProfileSectionModal
      open={open}
      title={isEdit ? "Update Education" : "Add Education"}
      onCancel={onCancel}
      loading={loading}
      formId={FORM_ID}
      width={860}
    >
      <Form id={FORM_ID} form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="School"
          name="institution"
          rules={[{ required: true, message: "Please enter your school name." }]}
        >
          <Input size="large" placeholder="Enter your school name" />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Degree"
            name="degree"
            rules={[{ required: true, message: "Please select your degree." }]}
          >
            <Select size="large" placeholder="Select degree" options={degreeOptions} />
          </Form.Item>

          <Form.Item
            label="Major"
            name="majorField"
            rules={[{ required: true, message: "Please enter your major." }]}
          >
            <Input size="large" placeholder="Computer Science" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item
            label="From"
            name="startMonth"
            rules={[{ required: true, message: "Please select a start date." }]}
          >
            <Input size="large" type="month" />
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
                <Input size="large" type="month" disabled={getFieldValue("isCurrent")} />
              </Form.Item>
            )}
          </Form.Item>

          <Form.Item label="GPA" name="gpa">
            <Input size="large" type="number" step="0.01" min="0" max="4" placeholder="3.50" />
          </Form.Item>
        </div>

        <Form.Item name="isCurrent" valuePropName="checked" className="!mb-0">
          <Checkbox>I am currently studying here</Checkbox>
        </Form.Item>
      </Form>
    </ProfileSectionModal>
  );
};

export default EducationFormModal;
