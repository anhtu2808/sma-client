import React from "react";
import ProfileSectionModal from "@/components/ProfileSectionModal";

const SetProfileConfirmModal = ({
  open,
  confirmValue,
  isSettingProfile,
  isConfirmLoading,
  canConfirmSetProfile,
  onChangeConfirmValue,
  onCancel,
  onConfirm,
}) => (
  <ProfileSectionModal
    open={open}
    title="Set resume as profile"
    onCancel={onCancel}
    loading={isSettingProfile || isConfirmLoading}
    loadingText="Processing..."
    submitText="Continue"
    submitDisabled={!canConfirmSetProfile || isSettingProfile || isConfirmLoading}
    cancelText="Cancel"
    width={520}
    formId="set-profile-confirm-form"
  >
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        This action will override all of your current profile information.
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type <span className="font-semibold">continue</span> to confirm
        </label>
        <form
          id="set-profile-confirm-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (canConfirmSetProfile && !isSettingProfile) {
              void onConfirm();
            }
          }}
        >
          <input
            type="text"
            value={confirmValue}
            onChange={(event) => onChangeConfirmValue(event.target.value)}
            disabled={isSettingProfile}
            placeholder="continue"
            className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </form>
      </div>
    </div>
  </ProfileSectionModal>
);

export default SetProfileConfirmModal;
