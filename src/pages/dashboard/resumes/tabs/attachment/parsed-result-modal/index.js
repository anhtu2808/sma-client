import React from "react";
import { Modal, Skeleton } from "antd";
import { useGetResumeQuery } from "@/apis/resumeApi";
import ParsedResultPreview from "../parsed-result-preview";

const ParsedResultModal = ({ open, resumeId, onClose, onSetAsProfile }) => {
  const { data: resumeDetail, isLoading } = useGetResumeQuery(
    { resumeId },
    { skip: !resumeId || !open }
  );

  const canSetAsProfile = resumeDetail?.parseStatus === "FINISH";

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnClose
      width={960}
    >
      <div className="-mx-6 -mt-2 border-b border-gray-100 px-6 pb-4">
        <h3 className="text-[20px] leading-7 font-bold text-gray-900">
          {resumeDetail?.resumeName || "Parsed Result"}
        </h3>
      </div>

      <div className="pt-6 max-h-[70vh] overflow-y-auto pr-1">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton active paragraph={{ rows: 3 }} />
            <Skeleton active paragraph={{ rows: 4 }} />
            <Skeleton active paragraph={{ rows: 3 }} />
          </div>
        ) : (
          <ParsedResultPreview data={resumeDetail} />
        )}
      </div>

      <div className="-mx-6 mt-8 border-t border-gray-100 px-6 pt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-5 h-10 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          Close
        </button>
        {canSetAsProfile && (
          <button
            type="button"
            onClick={() => onSetAsProfile(resumeId)}
            className="px-5 h-10 rounded-lg bg-primary text-white hover:opacity-90"
          >
            Set as Profile
          </button>
        )}
      </div>
    </Modal>
  );
};

export default ParsedResultModal;
