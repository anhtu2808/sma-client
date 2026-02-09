import React, { useEffect } from "react";
import { Form, Input, message } from "antd";
import ProfileSectionModal from "@/components/ProfileSectionModal";

const FORM_ID = "edit-profile-form";

const normalizeText = (value) => {
  const normalized = `${value ?? ""}`.trim().replace(/\s+/g, " ");
  return normalized ? normalized : null;
};

const normalizeUrl = (value) => {
  const normalized = normalizeText(value);
  return normalized;
};

const EditProfileModal = ({ open, loading, initialValues, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue({
      fullName: initialValues?.fullName ?? "",
      jobTitle: initialValues?.jobTitle ?? "",
      address: initialValues?.address ?? "",
      githubUrl: initialValues?.githubUrl ?? "",
      linkedinUrl: initialValues?.linkedinUrl ?? "",
      websiteUrl: initialValues?.websiteUrl ?? "",
      avatar: initialValues?.avatar ?? "",
    });
  }, [form, initialValues, open]);

  const handleFinish = (values) => {
    const payload = {
      fullName: normalizeText(values.fullName),
      jobTitle: normalizeText(values.jobTitle),
      address: normalizeText(values.address),
      githubUrl: normalizeUrl(values.githubUrl),
      linkedinUrl: normalizeUrl(values.linkedinUrl),
      websiteUrl: normalizeUrl(values.websiteUrl),
      avatar: normalizeUrl(values.avatar),
    };

    if (!payload.fullName) {
      message.error("Full name is required.");
      return;
    }

    onSubmit(payload);
  };

  return (
    <ProfileSectionModal
      open={open}
      title="Edit Profile"
      onCancel={onCancel}
      loading={loading}
      formId={FORM_ID}
      width={860}
    >
      <Form id={FORM_ID} form={form} layout="vertical" onFinish={handleFinish}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Full name"
            name="fullName"
            rules={[{ required: true, message: "Full name is required." }]}
          >
            <Input size="large" placeholder="Your name" />
          </Form.Item>

          <Form.Item label="Job title" name="jobTitle">
            <Input size="large" placeholder="e.g. Backend Engineer" />
          </Form.Item>
        </div>

        <Form.Item label="Address" name="address">
          <Input size="large" placeholder="City, Country" />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item label="GitHub URL" name="githubUrl">
            <Input size="large" placeholder="https://github.com/username" />
          </Form.Item>
          <Form.Item label="LinkedIn URL" name="linkedinUrl">
            <Input size="large" placeholder="https://linkedin.com/in/username" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item label="Website URL" name="websiteUrl">
            <Input size="large" placeholder="https://your-site.com" />
          </Form.Item>
          <Form.Item label="Avatar URL" name="avatar">
            <Input size="large" placeholder="https://..." />
          </Form.Item>
        </div>
      </Form>
    </ProfileSectionModal>
  );
};

export default EditProfileModal;

