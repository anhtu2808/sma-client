import React, { useEffect } from "react";
import { Form, Input } from "antd";
import ProfileSectionModal from "@/components/ProfileSectionModal";

const FORM_ID = "certification-form";

const CertificationFormModal = ({
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
    form.setFieldsValue({
      name: "",
      issuer: "",
      credentialUrl: "",
      image: "",
      description: "",
      ...initialValues,
    });
  }, [form, initialValues, open]);

  const handleFinish = (values) => {
    onSubmit({
      name: values.name?.trim() || null,
      issuer: values.issuer?.trim() || null,
      credentialUrl: values.credentialUrl?.trim() || null,
      image: values.image?.trim() || null,
      description: values.description?.trim() || null,
    });
  };

  return (
    <ProfileSectionModal
      open={open}
      title={isEdit ? "Update Certification" : "Add Certification"}
      onCancel={onCancel}
      loading={loading}
      formId={FORM_ID}
      width={860}
    >
      <Form id={FORM_ID} form={form} layout="vertical" onFinish={handleFinish}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Certification Name"
            name="name"
            rules={[{ required: true, message: "Please enter certification name." }]}
          >
            <Input size="large" placeholder="AWS Certified Developer" />
          </Form.Item>

          <Form.Item label="Issuer" name="issuer">
            <Input size="large" placeholder="Amazon Web Services" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item label="Credential URL" name="credentialUrl">
            <Input size="large" placeholder="https://..." />
          </Form.Item>

          <Form.Item label="Image URL" name="image">
            <Input size="large" placeholder="https://image-url..." />
          </Form.Item>
        </div>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} showCount maxLength={5000} placeholder="Highlight what this certification validates..." />
        </Form.Item>
      </Form>
    </ProfileSectionModal>
  );
};

export default CertificationFormModal;
