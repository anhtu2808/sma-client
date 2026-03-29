import React from "react";
import { enumToLabel, formatRange, getValidLink } from "@/utils/profileUtils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faRocket } from '../../../../../../utils/icons';

const ProjectsSection = ({ data }) => {
  const projects = data?.projects ?? [];
  if (projects.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
        <FontAwesomeIcon icon={faRocket} className="text-primary text-[18px]" />
        Projects
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {projects.map((project) => (
          <div key={project?.id} className="border border-gray-200 rounded-lg p-3">
            <div className="flex justify-between items-start gap-2 mb-1">
              <h4 className="text-sm font-bold text-gray-900">{project?.title || "N/A"}</h4>
              {project?.projectUrl && (
                <a
                  href={getValidLink(project.projectUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-500 hover:text-primary flex-shrink-0"
                >
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[16px]" />
                </a>
              )}
            </div>
            {project?.description && (
              <p className="text-xs text-gray-500 mb-2 line-clamp-2">{project.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-primary bg-primary/5 px-2 py-0.5 rounded">
                {formatRange(project?.startDate, project?.endDate, project?.isCurrent)}
              </span>
              {project?.projectType && (
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                  {enumToLabel(project.projectType)}
                </span>
              )}
              {project?.position && (
                <span className="text-xs px-2 py-0.5 rounded bg-orange-50 text-orange-700">
                  {project.position}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;
