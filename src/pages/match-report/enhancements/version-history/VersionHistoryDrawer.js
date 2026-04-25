import { useEffect, useMemo, useState } from 'react';
import { Badge, Drawer, Empty, Skeleton, Switch, Tag, Tooltip } from 'antd';
import { Loader2 } from 'lucide-react';
import toastMessage from '@/utils/toastMessage';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  useGetEnhancementVersionsQuery,
  useLazyGetEnhancementVersionDetailQuery,
  useRestoreEnhancementVersionMutation,
} from '@/apis/resumeApi';
import htmlDiff from './htmlDiff';

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
  const [previousVersion, setPreviousVersion] = useState(null);
  const [isLoadingPrevious, setIsLoadingPrevious] = useState(false);
  const [showDiff, setShowDiff] = useState(true);

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
      setPreviousVersion(null);
      setShowDiff(true);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !data?.content) return;
    setVersions((current) => {
      const merged = page === 0 ? [] : [...current];
      data.content.forEach((version) => {
        if (!merged.some((item) => item.id === version.id)) {
          merged.push(version);
        }
      });
      return merged;
    });
  }, [open, data, page]);

  const hasMore = useMemo(() => {
    if (!data) return false;
    return data.number + 1 < data.totalPages;
  }, [data]);

  const findPreviousMeta = (versionNumber) =>
    versions.find((item) => item.versionNumber === versionNumber - 1);

  const handleSelectVersion = async (versionId) => {
    setSelectedVersionId(versionId);
    setPreviousVersion(null);
    try {
      const detail = await getVersionDetail({ enhancementId, versionId }).unwrap();
      setSelectedVersion(detail);

      const prevMeta = findPreviousMeta(detail.versionNumber);
      if (prevMeta) {
        setIsLoadingPrevious(true);
        try {
          const prevDetail = await getVersionDetail({
            enhancementId,
            versionId: prevMeta.id,
          }).unwrap();
          setPreviousVersion(prevDetail);
        } catch {
          setPreviousVersion(null);
        } finally {
          setIsLoadingPrevious(false);
        }
      }
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

  const diffHtml = useMemo(() => {
    if (!selectedVersion) return '';
    if (!showDiff || !previousVersion) return selectedVersion.content || '';
    return htmlDiff(previousVersion.content || '', selectedVersion.content || '');
  }, [selectedVersion, previousVersion, showDiff]);

  const isFirstVersion =
    selectedVersion && !findPreviousMeta(selectedVersion.versionNumber);

  return (
    <Drawer
      title="Version history"
      placement="right"
      width={1200}
      open={open}
      onClose={onClose}
      destroyOnClose
      extra={
        selectedVersionId ? (
          <button
            type="button"
            onClick={handleRestore}
            disabled={isRestoring}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRestoring && <Loader2 size={14} className="animate-spin" />}
            Restore this version
          </button>
        ) : null
      }
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
                      active
                        ? 'border-primary bg-orange-50 ring-2 ring-primary/30 shadow-sm'
                        : version.isCurrent
                          ? 'border-primary/40 bg-white'
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
                <button
                  type="button"
                  onClick={() => setPage((value) => value + 1)}
                  disabled={isFetching}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isFetching && <Loader2 size={14} className="animate-spin" />}
                  Load more
                </button>
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
                <div className="min-w-0">
                  <div className="font-semibold text-neutral-900">
                    Version {selectedVersion?.versionNumber}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
                    <span>
                      {selectedVersion?.createdAt
                        ? dayjs(selectedVersion.createdAt).format('DD/MM/YYYY HH:mm')
                        : ''}
                    </span>
                    {isLoadingPrevious ? (
                      <Tag color="default" className="!m-0">
                        Loading diff…
                      </Tag>
                    ) : isFirstVersion ? (
                      <Tag color="blue" className="!m-0">
                        Initial version
                      </Tag>
                    ) : null}
                  </div>
                </div>
                {!isFirstVersion && previousVersion && (
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <span>Show diff</span>
                    <Switch
                      size="small"
                      checked={showDiff}
                      onChange={setShowDiff}
                      disabled={isLoadingPrevious}
                    />
                  </div>
                )}
              </div>
              <div
                className="tiptap-content version-diff min-h-[520px] rounded-md border border-neutral-200 bg-white p-6"
                dangerouslySetInnerHTML={{ __html: diffHtml }}
              />
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default VersionHistoryDrawer;
