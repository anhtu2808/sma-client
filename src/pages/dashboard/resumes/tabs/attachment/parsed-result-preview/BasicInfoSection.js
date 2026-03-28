import React from "react";
import { getValidLink } from "@/utils/profileUtils";

const LinkItem = ({ icon, label, url }) => {
  if (!url) return null;
  const href = getValidLink(url);
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
    >
      <span className="material-icons-round text-[16px]">{icon}</span>
      {label}
    </a>
  );
};

const BasicInfoSection = ({ data }) => {
  const fullName = data?.fullName;
  const jobTitle = data?.jobTitle;
  const summary = data?.summary;
  const address = data?.addressInResume;
  const email = data?.emailInResume;
  const phone = data?.phoneInResume;
  const github = data?.githubLink;
  const linkedin = data?.linkedinLink;
  const portfolio = data?.portfolioLink;

  const hasContact = email || phone || address;
  const hasLinks = github || linkedin || portfolio;
  if (!fullName && !jobTitle && !summary && !hasContact && !hasLinks) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
        <span className="material-icons-round text-primary text-[18px]">person</span>
        Basic Information
      </h3>
      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
        {fullName && <p className="text-lg font-bold text-gray-900">{fullName}</p>}
        {jobTitle && <p className="text-sm text-gray-600">{jobTitle}</p>}
        {summary && (
          <p className="text-sm text-gray-500 leading-relaxed mt-1">{summary}</p>
        )}

        {hasContact && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
            {email && (
              <span className="inline-flex items-center gap-1">
                <span className="material-icons-round text-[14px] text-gray-400">email</span>
                {email}
              </span>
            )}
            {phone && (
              <span className="inline-flex items-center gap-1">
                <span className="material-icons-round text-[14px] text-gray-400">phone</span>
                {phone}
              </span>
            )}
            {address && (
              <span className="inline-flex items-center gap-1">
                <span className="material-icons-round text-[14px] text-gray-400">location_on</span>
                {address}
              </span>
            )}
          </div>
        )}

        {hasLinks && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
            <LinkItem icon="code" label="GitHub" url={github} />
            <LinkItem icon="link" label="LinkedIn" url={linkedin} />
            <LinkItem icon="language" label="Portfolio" url={portfolio} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInfoSection;
