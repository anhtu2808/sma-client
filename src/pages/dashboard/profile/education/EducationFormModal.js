import React, { useEffect, useMemo } from "react";
import { Checkbox, DatePicker, Form, Input, Select } from "antd";
import dayjs from "dayjs";
import ProfileSectionModal from "@/components/ProfileSectionModal";

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
    const merged = {
      institution: "",
      degree: undefined,
      majorField: "",
      gpa: "",
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
      institution: values.institution?.trim() || null,
      degree: values.degree || null,
      majorField: values.majorField?.trim() || null,
      gpa: values.gpa === "" || values.gpa == null ? null : Number(values.gpa),
      startDate: values.startMonth ? values.startMonth.format("YYYY-MM-01") : null,
      endDate:
        values.isCurrent || !values.endMonth ? null : values.endMonth.format("YYYY-MM-01"),
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
