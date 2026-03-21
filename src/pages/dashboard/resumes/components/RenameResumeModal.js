import React, { useState, useEffect } from "react";
import { Modal, Input } from "antd";
import toastMessage from "@/utils/toastMessage";
import { useUpdateCandidateResumeMutation } from "@/apis/resumeApi";

const RenameResumeModal = ({ open, onClose, resume }) => {
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  
  const [updateResume, { isLoading }] = useUpdateCandidateResumeMutation();

  useEffect(() => {
    if (open && resume) {
      setNewName(resume.resumeName || resume.fileName || "");
      setError("");
    }
  }, [open, resume]);

  const handleCancel = () => {
    setNewName("");
    setError("");
    onClose();
  };

  const handleSubmit = async () => {
    // Validate
    const trimmedName = newName.trim();
    if (!trimmedName) {
      setError("Resume name is required");
      return;
    }
    if (trimmedName.length > 100) {
      setError("Resume name must not exceed 100 characters");
      return;
    }

    try {
      await updateResume({
        resumeId: resume.id,
        payload: {
          resumeName: trimmedName,
        },
      }).unwrap();
      
      toastMessage.success("Resume renamed successfully");
      handleCancel();
    } catch (err) {
      toastMessage.error(err?.data?.message || "Failed to rename resume");
    }
  };

  return (
    <Modal
      title="Rename Resume"
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={isLoading}
      okText="Save"
      cancelText="Cancel"
      centered
      destroyOnClose
    >
      <div className="py-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resume Name
        </label>
        <Input
          value={newName}
          onChange={(e) => {
            setNewName(e.target.value);
            setError("");
          }}
          placeholder="Enter resume name"
          maxLength={100}
          showCount
          status={error ? "error" : ""}
          autoFocus
          onPressEnter={handleSubmit}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
        <p className="mt-2 text-xs text-gray-500">
          This name helps you identify your resume in the list. It won&apos;t affect the file or any applications.
        </p>
      </div>
    </Modal>
  );
};

export default RenameResumeModal;
