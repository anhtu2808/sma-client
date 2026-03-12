import React, { useEffect, useState } from "react";
import { Form, Input, message, Upload } from "antd";
import ProfileSectionModal from "@/components/ProfileSectionModal";
import Loading from "@/components/Loading";
import { useUploadFilesMutation } from "@/apis/resumeApi";

const FORM_ID = "edit-profile-form";

const normalizeText = (value) => {
  const normalized = `${value ?? ""}`.trim().replace(/\s+/g, " ");
  return normalized ? normalized : null;
};

const normalizeUrl = (value) => {
  const normalized = normalizeText(value);
  return normalized;
};

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const EditProfileModal = ({ open, loading, initialValues, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [uploadFiles, { isLoading: isUploading }] = useUploadFilesMutation();
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (!open) {
      setPreviewImage("");
      return;
    }

    const currentAvatar = initialValues?.avatar ?? "";
    setPreviewImage(currentAvatar);

    form.setFieldsValue({
      fullName: initialValues?.fullName ?? "",
      jobTitle: initialValues?.jobTitle ?? "",
      phone: initialValues?.phone ?? "",
      address: initialValues?.address ?? "",
      githubUrl: initialValues?.githubUrl ?? "",
      linkedinUrl: initialValues?.linkedinUrl ?? "",
      websiteUrl: initialValues?.websiteUrl ?? "",
      avatar: currentAvatar,
    });
  }, [form, initialValues, open]);

  const handleFinish = (values) => {
    const payload = {
      fullName: normalizeText(values.fullName),
      jobTitle: normalizeText(values.jobTitle),
      phone: normalizeText(values.phone),
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

  const customUploadRequest = async ({ file, onSuccess, onError }) => {
    const isImage = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp";
    if (!isImage) {
      message.error("You can only upload JPG/PNG/WEBP files!");
      onError(new Error("Invalid file type"));
      return;
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("Image must smaller than 10MB!");
      onError(new Error("File too large"));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("files", file);

      const base64Preview = await getBase64(file);
      setPreviewImage(base64Preview);

      const uploadedFiles = await uploadFiles(formData).unwrap();
      const uploadedFile = Array.isArray(uploadedFiles) ? uploadedFiles[0] : null;

      if (!uploadedFile?.downloadUrl) {
        throw new Error("Upload failed");
      }

      form.setFieldValue("avatar", uploadedFile.downloadUrl);
      setPreviewImage(uploadedFile.downloadUrl);
      onSuccess("ok");
      message.success("Avatar uploaded successfully.");
    } catch (error) {
      setPreviewImage(form.getFieldValue("avatar"));
      onError(error);
      message.error("Failed to upload avatar.");
    }
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
        <div className="mb-6 flex flex-col items-center justify-center">
          <Form.Item name="avatar" className="hidden">
            <Input />
          </Form.Item>
          <Upload
            name="avatar"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            customRequest={customUploadRequest}
            accept="image/png, image/jpeg, image/webp"
          >
            <div className="relative h-[100px] w-[100px] overflow-hidden rounded-full">
              {isUploading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                  <Loading size={24} className="py-0" />
                </div>
              ) : null}
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Avatar relative"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center text-neutral-500">
                  <span className="material-icons-round mb-1 text-2xl">add_a_photo</span>
                  <div className="text-xs">Upload</div>
                </div>
              )}
            </div>
          </Upload>
          <div className="mt-2 text-xs text-neutral-500">Allowed JPG, PNG or WEBP. Max size of 10MB</div>
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item label="Phone number" name="phone">
            <Input size="large" placeholder="Your phone number" />
          </Form.Item>

          <Form.Item label="Address" name="address">
            <Input size="large" placeholder="City, Country" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item label="GitHub URL" name="githubUrl">
            <Input size="large" placeholder="https://github.com/username" />
          </Form.Item>
          <Form.Item label="LinkedIn URL" name="linkedinUrl">
            <Input size="large" placeholder="https://linkedin.com/in/username" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item label="Website URL" name="websiteUrl" className="md:col-span-2">
            <Input size="large" placeholder="https://your-site.com" />
          </Form.Item>
        </div>
      </Form>
    </ProfileSectionModal>
  );
};

export default EditProfileModal;

