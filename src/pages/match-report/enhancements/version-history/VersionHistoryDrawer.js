import { useEffect, useMemo, useState } from 'react';
import { Badge, Button, Drawer, Empty, Skeleton, Tooltip } from 'antd';
import toastMessage from '@/utils/toastMessage';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  useGetEnhancementVersionsQuery,
  useLazyGetEnhancementVersionDetailQuery,
  useRestoreEnhancementVersionMutation,
} from '@/apis/resumeApi';

dayjs.extend(relativeTime);

const PAGE_SIZE = 20;

const changeTypeMeta = {
  INITIAL: { color: 'blue', label: 'Initial' },
  AUTOSAVE: { color: 'default', label: 'Autosave' },
  MANUAL_SAVE: { color: 'green', label: 'Manual save' },
  AI_SUGGESTION_APPLIED: { color: 'purple', label: 'AI suggestion' },
  RESTORE: { color: 'orange', label: 'Restore' },
  RESCORE: { color: 'cyan', label: 'Re-score' },
};

const VersionHistoryDrawer = ({ open, enhancementId, onClose, onRestore }) => {
  const [page, setPage] = useState(0);
  const [versions, setVersions] = useState([]);
  const [selectedVersionId, setSelectedVersionId] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);

  const { data, isFetching, isLoading } = useGetEnhancementVersionsQuery(
    { enhancementId, page, size: PAGE_SIZE },
    { skip: !open || !enhancementId }
  );
  const [getVersionDetail, { isFetching: isPreviewLoading }] = useLazyGetEnhancementVersionDetailQuery();
  const [restoreVersion, { isLoading: isRestoring }] = useRestoreEnhancementVersionMutation();

  useEffect(() => {
    if (!open) {
      setPage(0);
      setVersions([]);
      setSelectedVersionId(null);
      setSelectedVersion(null);
    }
  }, [open]);

  useEffect(() => {
    if (!data?.content) return;
    setVersions((current) => {
      const merged = page === 0 ? [] : [...current];
      data.content.forEach((version) => {
        if (!merged.some((item) => item.id === version.id)) {
          merged.push(version);
        }
      });
      return merged;
    });
  }, [data, page]);

  const hasMore = useMemo(() => {
    if (!data) return false;
    return data.number + 1 < data.totalPages;
  }, [data]);

  const handleSelectVersion = async (versionId) => {
    setSelectedVersionId(versionId);
    try {
      const detail = await getVersionDetail({ enhancementId, versionId }).unwrap();
      setSelectedVersion(detail);
    } catch {
      toastMessage.error('Could not load this version');
    }
  };

  const handleRestore = async () => {
    if (!selectedVersionId) return;
    try {
      const response = await restoreVersion({ enhancementId, versionId: selectedVersionId }).unwrap();
      onRestore?.(response);
      toastMessage.success('Version restored');
      onClose?.();
    } catch {
      toastMessage.error('Could not restore this version');
    }
  };

  return (
    <Drawer
      title="Version history"
      placement="right"
      width={720}
      open={open}
      onClose={onClose}
      destroyOnClose
    >
      <div className="flex h-full min-h-0 gap-4">
        <div className="w-64 shrink-0 overflow-y-auto border-r border-neutral-200 pr-3">
          {isLoading && versions.length === 0 ? (
            <Skeleton active paragraph={{ rows: 8 }} />
          ) : versions.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No versions yet" />
          ) : (
            <div className="space-y-2">
              {versions.map((version) => {
                const meta = changeTypeMeta[version.changeType] || changeTypeMeta.AUTOSAVE;
                const active = version.id === selectedVersionId;
                return (
                  <button
                    key={version.id}
                    type="button"
                    onClick={() => handleSelectVersion(version.id)}
                    className={`w-full rounded-md border px-3 py-2 text-left transition-colors ${
                      active || version.isCurrent
                        ? 'border-primary bg-blue-50'
                        : 'border-neutral-200 bg-white hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-neutral-900">
                        Version {version.versionNumber}
                      </span>
                      {version.isCurrent && <span className="text-[11px] font-medium text-primary">Current</span>}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge color={meta.color} text={<span className="text-xs text-neutral-600">{meta.label}</span>} />
                    </div>
                    {version.label && <div className="mt-1 text-xs text-neutral-500">{version.label}</div>}
                    <Tooltip title={dayjs(version.createdAt).format('DD/MM/YYYY HH:mm:ss')}>
                      <div className="mt-1 text-xs text-neutral-400">{dayjs(version.createdAt).fromNow()}</div>
                    </Tooltip>
                  </button>
                );
              })}
              {hasMore && (
                <Button block loading={isFetching} onClick={() => setPage((value) => value + 1)}>
                  Load more
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 overflow-y-auto">
          {!selectedVersionId ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Select a version to preview" />
          ) : isPreviewLoading ? (
            <Skeleton active paragraph={{ rows: 12 }} />
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-neutral-900">
                    Version {selectedVersion?.versionNumber}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {selectedVersion?.createdAt ? dayjs(selectedVersion.createdAt).format('DD/MM/YYYY HH:mm') : ''}
                  </div>
                </div>
                <Button type="primary" loading={isRestoring} onClick={handleRestore}>
                  Restore this version
                </Button>
              </div>
              <div
                className="tiptap-content min-h-[520px] rounded-md border border-neutral-200 bg-white p-6"
                dangerouslySetInnerHTML={{ __html: selectedVersion?.content || '' }}
              />
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default VersionHistoryDrawer;
