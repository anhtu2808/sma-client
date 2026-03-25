import React from "react";
import { Skeleton } from "antd";
import ProfileSectionModal from "@/components/ProfileSectionModal";
import { useGetResumeQuery } from "@/apis/resumeApi";
import ParsedResultPreview from "../parsed-result-preview";

const SetProfileConfirmModal = ({
  open,
  resumeId,
  isSettingProfile,
  isConfirmLoading,
  onCancel,
  onConfirm,
}) => {
  const { data: resumeDetail, isLoading } = useGetResumeQuery(
    { resumeId },
    { skip: !resumeId || !open }
  );

  return (
    <ProfileSectionModal
      open={open}
      title="Set resume as profile"
      onCancel={onCancel}
      onSubmit={onConfirm}
      loading={isSettingProfile || isConfirmLoading}
      loadingText="Processing..."
      submitText="Confirm"
      submitDisabled={isSettingProfile || isConfirmLoading}
      cancelText="Cancel"
      width={960}
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          This action will override all of your current profile information with the parsed data below.
        </div>
        <div className="max-h-[400px] overflow-y-auto rounded-xl border border-gray-100 bg-white p-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton active paragraph={{ rows: 2 }} />
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          ) : (
            <ParsedResultPreview data={resumeDetail} />
          )}
        </div>
      </div>
    </ProfileSectionModal>
  );
};

export default SetProfileConfirmModal;
