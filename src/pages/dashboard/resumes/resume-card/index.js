import React, { useState } from "react";
import { Dropdown } from "antd";
import Button from "@/components/Button";
import RenameResumeModal from "../components/RenameResumeModal";

const scoreClassName = (score) => {
  if (score >= 85) return "bg-green-500";
  if (score >= 70) return "bg-blue-500";
  return "bg-yellow-500";
};

export const ResumeCard = ({ resume }) => {
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  const dropdownItems = [
    {
      key: "rename",
      label: "Rename",
      icon: <span className="material-icons-round text-[18px]">edit</span>,
      onClick: () => setIsRenameModalOpen(true),
    },
    {
      key: "download",
      label: "Download",
      icon: <span className="material-icons-round text-[18px]">download</span>,
    },
    {
      key: "share",
      label: "Share",
      icon: <span className="material-icons-round text-[18px]">share</span>,
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      label: "Delete",
      icon: <span className="material-icons-round text-[18px] text-red-500">delete</span>,
      danger: true,
    },
  ];

  return (
    <>
      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden h-full flex flex-col">
    <div className="relative h-44 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 p-4">
      <div className="absolute top-3 right-3 flex gap-2">
        {resume.tag ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-100 dark:border-purple-800">
            {resume.tag}
          </span>
        ) : null}
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {resume.status}
        </span>
      </div>

      <div className="w-3/4 h-full bg-white dark:bg-gray-700 rounded-t-lg p-4 border-x border-t border-gray-200 dark:border-gray-600">
        <div className="w-1/2 h-2 bg-gray-300 dark:bg-gray-500 rounded mb-2" />
        <div className="w-2/3 h-2 bg-gray-200 dark:bg-gray-600 rounded mb-2" />
        <div className="w-full h-px bg-gray-200 dark:bg-gray-600 mb-2" />
        <div className="space-y-2">
          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded" />
          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded" />
          <div className="w-3/4 h-1.5 bg-gray-200 dark:bg-gray-600 rounded" />
        </div>
      </div>
    </div>

    <div className="p-5 flex-1 flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate">{resume.title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last modified: {resume.lastModified}</p>
        </div>
        <Dropdown
          menu={{ items: dropdownItems }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <button type="button" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <span className="material-icons-round text-[20px]">more_vert</span>
          </button>
        </Dropdown>
      </div>

      <div className="mt-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div className={`h-2 rounded-full ${scoreClassName(resume.score)}`} style={{ width: `${resume.score}%` }} />
          </div>
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{resume.score}% Score</span>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-2">
        <Button
          mode="secondary"
          size="sm"
          shape="rounded"
          iconLeft={<span className="material-icons-round text-[18px]">edit</span>}
        >
          Edit
        </Button>
        <div className="flex items-center gap-1">
          <Button
            mode="ghost"
            size="sm"
            shape="rounded"
            btnIcon
            iconLeft={<span className="material-icons-round text-[18px]">download</span>}
          />
          <Button
            mode="ghost"
            size="sm"
            shape="rounded"
            btnIcon
            iconLeft={<span className="material-icons-round text-[18px]">share</span>}
          />
          <Button
            mode="ghost"
            size="sm"
            shape="rounded"
            btnIcon
            iconLeft={<span className="material-icons-round text-[18px]">delete</span>}
          />
        </div>
      </div>
    </div>
  </div>

      <RenameResumeModal
        open={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        resume={resume}
      />
    </>
  );
};

export const CreateResumeCard = ({ onCreate }) => (
  <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center p-8 h-full aspect-square">
    <button
      type="button"
      aria-label="Create new resume"
      onClick={onCreate}
      className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4 hover:bg-primary hover:text-white dark:hover:bg-gray-600 transition-colors"
    >
      <span className="material-icons-round text-[24px] text-gray-700 dark:text-gray-100">add</span>
    </button>
    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Create New Resume</h3>
    <p className="text-sm text-center text-gray-500 dark:text-gray-400">Start from a template or import data</p>
  </div>
);

export const ResumeListItem = ({ resume }) => {
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 flex items-center gap-4">
    <div className="h-12 w-12 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center flex-none">
      <span className="material-icons-round text-gray-500 dark:text-gray-300">description</span>
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white truncate">{resume.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last modified: {resume.lastModified}</p>
        </div>
        <div className="flex items-center gap-2 flex-none">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{resume.score}%</span>
          <div className="w-28 bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div className={`h-2 rounded-full ${scoreClassName(resume.score)}`} style={{ width: `${resume.score}%` }} />
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {resume.tag ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-100 dark:border-purple-800">
              {resume.tag}
            </span>
          ) : null}
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            {resume.status}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            type="button" 
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors" 
            title="Rename"
            onClick={() => setIsRenameModalOpen(true)}
          >
            <span className="material-icons-round text-[18px]">edit</span>
          </button>
          <button type="button" className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Download">
            <span className="material-icons-round text-[18px]">download</span>
          </button>
          <button type="button" className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Share">
            <span className="material-icons-round text-[18px]">share</span>
          </button>
          <button type="button" className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Delete">
            <span className="material-icons-round text-[18px]">delete</span>
          </button>
        </div>
      </div>
    </div>
  </div>

      <RenameResumeModal
        open={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        resume={resume}
      />
    </>
  );
};

export const TemplateCard = ({ template, onSelect }) => (
  <div className="group bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow relative cursor-pointer" onClick={() => onSelect(template)}>
    <div className={`relative h-80 ${template.bgColor} border-b border-gray-100 dark:border-gray-700 p-6 flex justify-center items-center overflow-hidden`}>
      {template.preview ? (
        <img
          src={template.preview}
          alt={template.name}
          className="h-full object-contain rounded-md shadow-sm border border-gray-200 transform transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-[200px] h-[286px] bg-white rounded-md shadow-sm border border-gray-200 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105">
          <span className="material-icons-round text-gray-300 text-[48px]">description</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm z-10">
        <Button mode="primary" size="md" shape="rounded">
          Use Template
        </Button>
      </div>

      {template.isPremium && (
        <div className="absolute top-3 right-3 text-amber-500 bg-white/80 dark:bg-gray-800/80 rounded-full p-1 shadow-sm backdrop-blur inline-flex items-center justify-center !w-8 !h-8 z-20">
          <i className="material-icons-round text-[20px] drop-shadow-sm">workspace_premium</i>
        </div>
      )}
    </div>

    <div className="p-4 flex-1 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-gray-900 dark:text-white text-base truncate pr-2">{template.name}</h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{template.description}</p>
      </div>
    </div>
  </div>
);
