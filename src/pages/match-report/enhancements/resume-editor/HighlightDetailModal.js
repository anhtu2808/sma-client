import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Suggestions from '@/pages/match-report/sidebar/content/suggestions';
import { useMarkDetailAsFixedBatchMutation, useRegenerateSuggestionMutation } from '@/apis/matchingApi';
import {
  setDetailContext,
  setDetailFixed,
  setDetailPinnedRange,
  setFocusedItemId,
  setHighlightModalDetailId,
  updateScoresAfterFixed,
  updateSuggestion,
} from '@/store/slices/matchingReportSlice';
import { getErrorMessage } from '@/constant/attachment';
import toastMessage from '@/utils/toastMessage';
import EditorContext from '@/pages/match-report/enhancements/EditorContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowsRotate,
  faChevronLeft,
  faChevronRight,
  faThumbsDown,
  faThumbsUp,
  faXmark,
} from '../../../../utils/icons';
import { stripHtml } from './utils/prosemirrorSearch';

const HighlightDetailModal = ({ detail, open, onClose }) => {
  const dispatch = useDispatch();
  const popoverRef = useRef(null);
  const cleanupRef = useRef(null);
  const [regenerateSuggestion] = useRegenerateSuggestionMutation();
  const [markDetailAsFixedBatch] = useMarkDetailAsFixedBatchMutation();
  const [regeneratingSuggestionId, setRegeneratingSuggestionId] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const { fixInEditor, editor, pushFixUndo } = useContext(EditorContext);
  const matchData = useSelector((state) => state.matchingReport.data);

  // Siblings = all details sharing the same contextId, in document order.
  const siblings = useMemo(() => {
    if (!detail) return [];
    if (detail.contextId == null || !matchData?.criteriaScores) return [detail];
    const result = [];
    for (const cs of matchData.criteriaScores) {
      for (const d of cs.details ?? []) {
        if (d.contextId === detail.contextId) result.push(d);
      }
    }
    return result.length > 0 ? result : [detail];
  }, [detail, matchData?.criteriaScores]);

  // Sync carousel index to whichever sibling matches the incoming `detail` prop
  // (sidebar click → jump to that sibling; editor tag click → first sibling).
  useEffect(() => {
    if (!detail || siblings.length === 0) return;
    const idx = siblings.findIndex((s) => s.id === detail.id);
    setActiveIdx(idx >= 0 ? idx : 0);
  }, [detail?.id, siblings]); // eslint-disable-line react-hooks/exhaustive-deps

  // Position popover below the clicked highlight.
  useEffect(() => {
    if (!open || !detail || !popoverRef.current) return;

    const highlightEl = document.querySelector(`[data-detail-id="${detail.id}"][data-tag="true"]`);
    if (!highlightEl) return;

    const editorScroller = highlightEl.closest('.overflow-y-auto');
    if (!editorScroller) return;

    const hlRect = highlightEl.getBoundingClientRect();
    const scrollerRect = editorScroller.getBoundingClientRect();
    const popover = popoverRef.current;

    const top = hlRect.bottom - scrollerRect.top + editorScroller.scrollTop + 8;
    const left = Math.max(8, hlRect.left - scrollerRect.left);
    const maxLeft = scrollerRect.width - 580;

    popover.style.top = `${top}px`;
    popover.style.left = `${Math.min(left, maxLeft)}px`;
  }, [open, detail]);

  // Close on outside click / Escape. Delayed listener attach avoids closing from the opening click.
  useEffect(() => {
    if (!open) return;

    let attached = false;

    const timeoutId = setTimeout(() => {
      attached = true;

      const handlePointerDown = (e) => {
        if (!popoverRef.current) return;
        if (popoverRef.current.contains(e.target)) return;
        if (e.target.closest?.('[data-tag="true"]')) return;
        if (e.target.closest?.('[id^="sidebar-item-"]')) return;
        onClose();
      };
      const handleEsc = (e) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('pointerdown', handlePointerDown, true);
      document.addEventListener('keydown', handleEsc);

      cleanupRef.current = () => {
        document.removeEventListener('pointerdown', handlePointerDown, true);
        document.removeEventListener('keydown', handleEsc);
      };
    }, 250);

    return () => {
      clearTimeout(timeoutId);
      if (attached) {
        cleanupRef.current?.();
      }
    };
  }, [open, onClose]);

  if (!open || !detail) return null;

  const activeSibling = siblings[activeIdx] ?? detail;
  const hasSuggestions = Array.isArray(detail.suggestions) && detail.suggestions.length > 0;
  const isPositiveStatus = detail.isFixed || detail.status === 'MATCHED' || detail.status === 'FIXED';
  const canRegenerate = !isPositiveStatus;
  const hasMultiple = siblings.length > 1;

  const goPrev = () => {
    const next = Math.max(0, activeIdx - 1);
    setActiveIdx(next);
    const sibling = siblings[next];
    if (sibling) dispatch(setHighlightModalDetailId(sibling.id));
  };

  const goNext = () => {
    const next = Math.min(siblings.length - 1, activeIdx + 1);
    setActiveIdx(next);
    const sibling = siblings[next];
    if (sibling) dispatch(setHighlightModalDetailId(sibling.id));
  };

  const goTo = (idx) => {
    setActiveIdx(idx);
    const sibling = siblings[idx];
    if (sibling) dispatch(setHighlightModalDetailId(sibling.id));
  };

  const handleRegenerateSuggestion = async (suggestionId) => {
    if (regeneratingSuggestionId != null) return;
    setRegeneratingSuggestionId(suggestionId);
    try {
      const updated = await regenerateSuggestion({ suggestionId }).unwrap();
      dispatch(updateSuggestion(updated));
      toastMessage.success('Suggestion regenerated successfully.');
    } catch (error) {
      toastMessage.error(getErrorMessage(error, 'Unable to regenerate suggestion.'));
    } finally {
      setRegeneratingSuggestionId(null);
    }
  };

  const handleApply = async () => {
    const firstSuggestion = detail.suggestions?.[0]?.suggestion;
    if (!firstSuggestion || !fixInEditor || !detail.context) return;

    const siblingDetailIds = (() => {
      if (!matchData?.criteriaScores || detail.contextId == null) return [detail.id];
      const ids = [];
      for (const cs of matchData.criteriaScores) {
        for (const d of cs.details ?? []) {
          if (d.contextId === detail.contextId) ids.push(d.id);
        }
      }
      return ids.length > 0 ? ids : [detail.id];
    })();

    const beforeDoc = editor?.state?.doc;
    const beforeOverallScore = matchData?.aiOverallScore;
    const beforeCriteriaScore = matchData?.criteriaScores
      ? (() => {
          for (const cs of matchData.criteriaScores) {
            if (cs.details?.some((d) => d.id === detail.id)) return cs.aiScore;
          }
          return undefined;
        })()
      : undefined;

    setIsApplying(true);
    const result = await fixInEditor(detail.context, firstSuggestion, detail.id);
    const success = result?.success;
    const pinnedRange = result?.range || null;
    if (success) {
      const plainSuggestion = stripHtml(firstSuggestion);
      for (const sid of siblingDetailIds) {
        dispatch(setDetailContext({ detailId: sid, context: plainSuggestion }));
        if (pinnedRange) {
          dispatch(setDetailPinnedRange({ detailId: sid, range: pinnedRange }));
        }
      }
      try {
        const response = await markDetailAsFixedBatch({ detailIds: siblingDetailIds }).unwrap();
        for (const sid of siblingDetailIds) {
          dispatch(setDetailFixed({ detailId: sid }));
        }
        if (response) {
          dispatch(updateScoresAfterFixed({
            afterOverallScore: response.afterOverallScore,
            criteriaScoreId: response.criteriaScoreId,
            afterCriteriaScore: response.afterCriteriaScore,
          }));

          if (beforeDoc && pushFixUndo) {
            pushFixUndo({
              beforeDoc,
              detailIds: siblingDetailIds,
              criteriaScoreId: response.criteriaScoreId,
              beforeOverallScore,
              beforeCriteriaScore,
              originalContext: detail.context,
            });
          }
        }
        toastMessage.success('Fix applied successfully.');
        dispatch(setFocusedItemId(detail.id));
        setTimeout(() => dispatch(setFocusedItemId(null)), 2500);
      } catch (error) {
        toastMessage.error(getErrorMessage(error, 'Fix applied but failed to update status.'));
      }
    }
    setIsApplying(false);
    onClose();
  };

  return (
    <div
      ref={popoverRef}
      className="absolute z-50 w-[580px] rounded-lg border border-neutral-200 bg-white shadow-xl"
      style={{ maxHeight: 400 }}
    >
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-2.5">
        <span className="text-[13px] font-medium text-neutral-500">Suggestion Preview</span>
        <button
          type="button"
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
        >
          <FontAwesomeIcon icon={faXmark} className="text-[16px]" />
        </button>
      </div>

      <div className="max-h-[300px] overflow-y-auto">
        {activeSibling?.description && (
          <div className="mx-4 mt-3 mb-1">
            <div className="relative">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(-${activeIdx * 100}%)` }}
                >
                  {siblings.map((s) => {
                    const sSibling = s;
                    const sIsPositive = sSibling.isFixed || sSibling.status === 'MATCHED' || sSibling.status === 'FIXED';
                    const descCardClass = sIsPositive
                      ? 'flex w-full flex-col rounded-lg border-2 border-emerald-300 bg-emerald-50 px-3.5 py-3 shadow-sm'
                      : 'flex w-full flex-col rounded-lg border-2 border-amber-300 bg-amber-100 px-3.5 py-3 shadow-sm';

                    return (
                      <div key={s.id} className="flex w-full shrink-0 px-px">
                        <div className={descCardClass}>
                          <p className="mb-1.5 text-sm font-semibold leading-snug text-neutral-900">
                            {s.label}
                          </p>
                          <p className="text-sm leading-relaxed text-neutral-800">
                            {s.description || '—'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {hasMultiple && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={activeIdx === 0}
                    aria-label="Previous"
                    className="absolute -left-3 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-600 shadow-md ring-1 ring-amber-300 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className="text-[12px]" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={activeIdx === siblings.length - 1}
                    aria-label="Next"
                    className="absolute -right-3 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-600 shadow-md ring-1 ring-amber-300 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FontAwesomeIcon icon={faChevronRight} className="text-[12px]" />
                  </button>
                </>
              )}
            </div>

            {hasMultiple && (
              <div className="mt-2 flex items-center justify-center gap-1.5">
                {siblings.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to issue ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === activeIdx ? 'w-5 bg-amber-500' : 'w-1.5 bg-amber-300 hover:bg-amber-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {hasSuggestions && !isPositiveStatus && (
          <Suggestions
            itemKey={detail.id}
            suggestions={detail.suggestions}
            isFocused={false}
            compact
            canRegenerate={canRegenerate}
            regeneratingSuggestionId={regeneratingSuggestionId}
            onRegenerateSuggestion={handleRegenerateSuggestion}
            context={detail.context}
            detailId={detail.id}
            allDetailIds={siblings.map((s) => s.id)}
          />
        )}
      </div>

      <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-2">
        <div className="flex items-center gap-2">
          <button type="button" className="flex h-7 w-7 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600">
            <FontAwesomeIcon icon={faArrowsRotate} className="text-[16px]" />
          </button>
          <button type="button" className="flex h-7 w-7 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600">
            <FontAwesomeIcon icon={faThumbsUp} className="text-[16px]" />
          </button>
          <button type="button" className="flex h-7 w-7 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600">
            <FontAwesomeIcon icon={faThumbsDown} className="text-[16px]" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded px-3 py-1.5 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-100"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isApplying || isPositiveStatus || !hasSuggestions}
            onClick={handleApply}
            className="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApplying ? 'Applying...' : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HighlightDetailModal;
