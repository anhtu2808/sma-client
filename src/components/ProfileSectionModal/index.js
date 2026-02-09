import React from "react";
import { Modal } from "antd";

const ProfileSectionModal = ({
  open,
  title,
  onCancel,
  loading = false,
  submitText = "Save",
  cancelText = "Cancel",
  width = 860,
  formId,
  children,
}) => {
  return (
    <Modal open={open} onCancel={onCancel} footer={null} centered destroyOnClose width={width}>
      <div className="-mx-6 -mt-2 border-b border-gray-100 px-6 pb-4">
        <h3 className="text-[20px] leading-7 font-bold text-gray-900">{title}</h3>
      </div>

      <div className="pt-6">{children}</div>

      <div className="-mx-6 mt-8 border-t border-gray-100 px-6 pt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-5 h-10 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          {cancelText}
        </button>

        <button
          type={formId ? "submit" : "button"}
          form={formId}
          disabled={loading}
          className="px-5 h-10 rounded-lg bg-primary text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Saving..." : submitText}
        </button>
      </div>
    </Modal>
  );
};

export default ProfileSectionModal;
