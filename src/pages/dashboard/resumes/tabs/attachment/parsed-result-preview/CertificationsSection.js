import React from "react";
import { getHostLabel, getValidLink } from "@/utils/profileUtils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal, faStar } from '../../../../../../utils/icons';

const CertificationsSection = ({ data }) => {
  const certifications = data?.certifications ?? [];
  if (certifications.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
        <FontAwesomeIcon icon={faMedal} className="text-primary text-[18px]" />
        Certifications
      </h3>
      <div className="space-y-2">
        {certifications.map((cert) => (
          <div key={cert?.id} className="flex gap-2.5 items-start">
            <FontAwesomeIcon icon={faStar} className="text-yellow-500 text-[16px] mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-900">{cert?.name || "N/A"}</h4>
              <p className="text-xs text-gray-500">{cert?.issuer || "N/A"}</p>
              {cert?.credentialUrl && (
                <a
                  href={getValidLink(cert.credentialUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  {getHostLabel(cert.credentialUrl)}
                </a>
              )}
              {cert?.description && (
                <p className="text-xs text-gray-500 mt-1">{cert.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificationsSection;
