import React from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "antd";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import { getParseStatusView, normalizeParseStatus } from "@/constant/attachment";

const FilesList = ({
  files,
  isLoadingResumes,
  pollingByResumeId,
  activeParsingResumeId,
  deletingId,
  isSettingProfile,
  settingProfileId,
  onOpenParseConsent,
  onOpenSetProfileConfirm,
  onDeleteResume,
  onRename,
  onViewParsedResult,
  onEditResume,
  uploadQuota,
}) => {
  const navigate = useNavigate();

  return (
  <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">Attached Files</h3>
      {uploadQuota ? (
        <div className="flex items-center gap-1">
          <span className={`text-sm font-semibold ${uploadQuota.exhausted ? "text-red-600" : "text-gray-600 dark:text-gray-400"}`}>
            {uploadQuota.used}/{uploadQuota.max}
          </span>
          <Tooltip title={uploadQuota.exhausted
            ? "Upload limit reached. Upload a new resume to replace an existing one."
            : "Upgrade your plan to unlock more uploads"
          }>
            <span className={`material-icons-round text-[16px] cursor-help ${uploadQuota.exhausted ? "text-red-400" : "text-gray-400 dark:text-gray-500"}`}>
              info
            </span>
          </Tooltip>
        </div>
      ) : (
        <span className="text-xs text-gray-500 dark:text-gray-400">{files.length} file(s)</span>
      )}
    </div>

    {isLoadingResumes ? (
      <Loading className="py-0" />
    ) : files.length === 0 ? (
      <p className="text-sm text-gray-500 dark:text-gray-400">No attached resume yet.</p>
    ) : (
      <div className="space-y-3">
        {files.map((file) => {
          const isPolling = Boolean(pollingByResumeId[file.id]);
          const statusView = getParseStatusView(file.status, isPolling);
          const normalizedStatus = normalizeParseStatus(file.status);
          const isParseBusy = isPolling || normalizedStatus === "PARTIAL" || activeParsingResumeId === file.id;
          const canSetAsProfile = normalizedStatus === "FINISH";
          const parseActionLabel = normalizedStatus === "FINISH" ? "Re-parse" : "Parse resume";

          return (
            <div
              key={file.id}
              className="flex items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-none">
                  <span className={`material-icons-round ${file.type === "pdf" ? "text-red-500" : "text-blue-500"}`}>
                    {file.type === "pdf" ? "picture_as_pdf" : "description"}
                  </span>
                </div>
                <div className="min-w-0">
                  {file.url ? (
                    <button
                      type="button"
                      onClick={() => navigate(`/cv-preview/${file.id}`)}
                      className="text-sm font-medium text-gray-900 dark:text-white truncate hover:text-primary hover:underline block cursor-pointer text-left bg-transparent border-none p-0"
                    >
                      {file.name}
                    </button>
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                  )}
                  <div className="mt-1 flex items-center gap-2">
                    {file.fileName && file.fileName !== file.name && (
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{file.fileName}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">Uploaded: {file.uploadTime}</p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusView.className}`}
                    >
                      {(isPolling || normalizedStatus === "PARTIAL") && (
                        <i className="material-icons-round animate-spin text-[12px] leading-none">autorenew</i>
                      )}
                      {statusView.label}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-none">
                <Button
                  mode="ghost"
                  size="sm"
                  shape="rounded"
                  btnIcon
                  tooltip="Rename"
                  onClick={() => onRename(file.id)}
                >
                  <i className="material-icons-round text-[18px]">edit</i>
                </Button>
                <Button
                  mode="ghost"
                  size="sm"
                  shape="rounded"
                  btnIcon
                  tooltip="Download"
                  disabled={!file.url}
                  onClick={() => file.url && window.open(file.url, "_blank", "noopener,noreferrer")}
                >
                  <i className="material-icons-round text-[18px]">download</i>
                </Button>

                {canSetAsProfile && (
                  <Button
                    mode="ghost"
                    size="sm"
                    shape="rounded"
                    btnIcon
                    tooltip="View parsed result"
                    onClick={() => onViewParsedResult(file.id)}
                  >
                    <i className="material-icons-round text-[18px]">visibility</i>
                  </Button>
                )}

                {canSetAsProfile && (
                  <Button
                    mode="ghost"
                    size="sm"
                    shape="rounded"
                    btnIcon
                    tooltip="Edit CV"
                    onClick={() => onEditResume(file.id)}
                  >
                    <i className="material-icons-round text-[18px]">edit_note</i>
                  </Button>
                )}

                {normalizedStatus !== "FINISH" && (
                  <Button
                    mode="ghost"
                    size="sm"
                    shape="rounded"
                    btnIcon
                    tooltip={parseActionLabel}
                    disabled={isParseBusy}
                    onClick={() => onOpenParseConsent(file.id)}
                  >
                    <i className="material-icons-round text-[18px]">psychology</i>
                  </Button>
                )}

                <Button
                  mode="ghost"
                  size="sm"
                  shape="rounded"
                  btnIcon
                  tooltip={canSetAsProfile ? "Set as profile" : "Only parsed resume can be set as profile"}
                  disabled={!canSetAsProfile || isSettingProfile || settingProfileId === file.id}
                  onClick={() => onOpenSetProfileConfirm(file.id)}
                >
                  <i className="material-icons-round text-[18px]">account_circle</i>
                </Button>
                <Button
                  mode="ghost"
                  size="sm"
                  shape="rounded"
                  btnIcon
                  tooltip="Delete"
                  disabled={deletingId === file.id}
                  onClick={() => onDeleteResume(file.id)}
                >
                  <i className="material-icons-round text-[18px]">delete</i>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
  );
};

export default FilesList;
