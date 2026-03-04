import React from "react";
import ProfileSectionModal from "@/components/ProfileSectionModal";

const ParseConsentModal = ({
  open,
  mode,
  isConsentLoading,
  onCancel,
  onSubmit,
}) => (
  <ProfileSectionModal
    open={open}
    title="Parse resume with AI"
    onCancel={onCancel}
    loading={isConsentLoading}
    loadingText="Processing..."
    submitText="Parse now"
    submitDisabled={isConsentLoading}
    cancelText={mode === "upload" ? "Skip for now" : "Cancel"}
    width={620}
    formId="parse-resume-consent-form"
  >
    <div className="space-y-4">
      <p className="text-sm text-gray-700">Parsing your resume enables:</p>
      <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
        <li>Using this resume as a profile source.</li>
        <li>AI scoring for resume matching against job descriptions.</li>
        <li>Importing data into CV Builder for faster editing.</li>
      </ul>

      {mode === "upload" && (
        <p className="text-xs text-gray-500">You can skip now and parse later using the Parse resume action in this list.</p>
      )}

      <form
        id="parse-resume-consent-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!isConsentLoading) {
            void onSubmit();
          }
        }}
      />
    </div>
  </ProfileSectionModal>
);

export default ParseConsentModal;
