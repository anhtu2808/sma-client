import React, { useMemo, useState } from "react";
import { message } from "antd";
import { useCandidateDashboardProfileQuery } from "@/apis/candidateApi";
import {
  useCreateResumeCertificationMutation,
  useUpdateResumeCertificationMutation,
} from "@/apis/resumeApi";
import { getHostLabel, getValidLink } from "@/utils/profileUtils";
import CertificationFormModal from "@/pages/dashboard/profile/certifications/CertificationFormModal";

const Certifications = () => {
  const { data: profile } = useCandidateDashboardProfileQuery();
  const profileResumeId = profile?.profileResumeId;
  const certifications = useMemo(() => profile?.certifications ?? [], [profile?.certifications]);

  const [editingCertification, setEditingCertification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [createCertification, { isLoading: isCreating }] = useCreateResumeCertificationMutation();
  const [updateCertification, { isLoading: isUpdating }] = useUpdateResumeCertificationMutation();
  const isSaving = isCreating || isUpdating;

  const openCreateModal = () => {
    setEditingCertification(null);
    setIsModalOpen(true);
  };

  const openEditModal = (certification) => {
    setEditingCertification(certification);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingCertification(null);
  };

  const handleSubmit = async (payload) => {
    if (!profileResumeId) {
      message.error("No PROFILE resume found.");
      return;
    }

    try {
      if (editingCertification?.id) {
        await updateCertification({
          resumeId: profileResumeId,
          certificationId: editingCertification.id,
          payload,
        }).unwrap();
        message.success("Certification updated successfully.");
      } else {
        await createCertification({ resumeId: profileResumeId, payload }).unwrap();
        message.success("Certification added successfully.");
      }

      closeModal();
    } catch (error) {
      message.error(error?.data?.message || "Failed to save certification.");
    }
  };

  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg text-primary">
            <span className="material-icons-round">workspace_premium</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Certifications</h2>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
        >
          <span className="material-icons-round text-[18px] border border-current rounded-full p-[1px]">
            add
          </span>
          Add Certification
        </button>
      </div>

      <div className="p-6 space-y-4">
        {certifications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-primary/40 bg-primary/[0.04] p-5">
            <p className="text-sm italic text-gray-500 dark:text-gray-400 mb-3">
              Add relevant certifications to improve profile credibility.
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              <span className="material-icons-round text-[18px] border border-current rounded-full p-[1px]">
                add
              </span>
              Add Certification
            </button>
          </div>
        ) : (
          certifications.map((certification) => (
            <div key={certification?.id} className="flex gap-3 items-start">
              <div className="mt-1">
                <span className="material-icons-round text-yellow-500 text-[18px]">star</span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{certification?.name || "N/A"}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{certification?.issuer || "N/A"}</p>
                    {certification?.credentialUrl ? (
                      <a
                        href={getValidLink(certification.credentialUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        {getHostLabel(certification.credentialUrl)}
                      </a>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => openEditModal(certification)}
                    className="text-gray-400 hover:text-primary transition-colors"
                    title="Edit"
                  >
                    <span className="material-icons-round text-[18px]">edit</span>
                  </button>
                </div>
                {certification?.description ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{certification.description}</p>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>

      <CertificationFormModal
        open={isModalOpen}
        isEdit={!!editingCertification}
        initialValues={
          editingCertification
            ? {
                name: editingCertification?.name ?? "",
                issuer: editingCertification?.issuer ?? "",
                credentialUrl: editingCertification?.credentialUrl ?? "",
                image: editingCertification?.image ?? "",
                description: editingCertification?.description ?? "",
              }
            : null
        }
        loading={isSaving}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Certifications;
