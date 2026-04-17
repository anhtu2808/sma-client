import React, { useEffect, useState } from "react";
import { Form, Input, Upload } from "antd";
import ProfileSectionModal from "@/components/ProfileSectionModal";
import SimpleTextEditor from "@/components/SimpleTextEditor";
import { useUploadFilesMutation } from "@/apis/resumeApi";
import toastMessage from "@/utils/toastMessage";
import Loading from "@/components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faTrash } from "@/utils/icons";

const FORM_ID = "certification-form";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const CertificationFormModal = ({
  open,
  isEdit = false,
  initialValues,
  loading = false,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [uploadFiles, { isLoading: isUploading }] = useUploadFilesMutation();
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (!open) {
      setPreviewImage("");
      return;
    }
    const currentImage = initialValues?.image ?? "";
    setPreviewImage(currentImage);
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

  const customUploadRequest = async ({ file, onSuccess, onError }) => {
    const isImage = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp";
    if (!isImage) {
      toastMessage.error("You can only upload JPG/PNG/WEBP files!");
      onError(new Error("Invalid file type"));
      return;
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      toastMessage.error("Image must be smaller than 10MB!");
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

      form.setFieldValue("image", uploadedFile.downloadUrl);
      setPreviewImage(uploadedFile.downloadUrl);
      onSuccess("ok");
      toastMessage.success("Image uploaded successfully.");
    } catch (error) {
      setPreviewImage(form.getFieldValue("image"));
      onError(error);
      toastMessage.error("Failed to upload image.");
    }
  };

  const handleRemoveImage = () => {
    form.setFieldValue("image", "");
    setPreviewImage("");
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
          <Form.Item label="Credential URL" name="credentialUrl" className="md:col-span-2">
            <Input size="large" placeholder="https://..." />
          </Form.Item>
        </div>

        <Form.Item name="image" className="hidden">
          <Input />
        </Form.Item>

        <Form.Item label="Certification Image">
          {previewImage ? (
            <div className="relative group w-full rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800">
              <img
                src={previewImage}
                alt="Certification"
                className="w-full max-h-[200px] object-contain p-2"
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                  <Loading size={24} className="py-0" />
                </div>
              )}
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              >
                <FontAwesomeIcon icon={faTrash} className="text-xs" />
              </button>
            </div>
          ) : (
            <Upload.Dragger
              showUploadList={false}
              customRequest={customUploadRequest}
              accept="image/png, image/jpeg, image/webp"
              disabled={isUploading}
            >
              {isUploading ? (
                <div className="py-4">
                  <Loading size={24} className="py-0" />
                  <p className="mt-2 text-sm text-gray-500">Uploading...</p>
                </div>
              ) : (
                <div className="py-4">
                  <FontAwesomeIcon icon={faCloudArrowUp} className="text-3xl text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click or drag image to upload
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    JPG, PNG or WEBP (max 10MB)
                  </p>
                </div>
              )}
            </Upload.Dragger>
          )}
        </Form.Item>

        <Form.Item label="Description" name="description">
          <SimpleTextEditor showCount maxLength={5000} placeholder="Highlight what this certification validates..." />
        </Form.Item>
      </Form>
    </ProfileSectionModal>
  );
};

export default CertificationFormModal;
