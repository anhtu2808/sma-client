import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Suggestions from '@/pages/match-report/sidebar/content/suggestions';
import { useRegenerateSuggestionMutation } from '@/apis/matchingApi';
import {
  setHighlightModalDetailId,
  updateSuggestion,
} from '@/store/slices/matchingReportSlice';
import { getErrorMessage } from '@/constant/attachment';
import toastMessage from '@/utils/toastMessage';
import EditorContext from '@/pages/match-report/enhancements/EditorContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faXmark,
} from '../../../../utils/icons';

const HighlightDetailModal = ({ detail, open, onClose }) => {
  const dispatch = useDispatch();
  const popoverRef = useRef(null);
  const cleanupRef = useRef(null);
  const scrolledForDetailRef = useRef(null);
  const [regenerateSuggestion] = useRegenerateSuggestionMutation();
  const [regeneratingSuggestionId, setRegeneratingSuggestionId] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const { applySuggestion } = useContext(EditorContext);
  const matchData = useSelector((state) => state.matchingReport.data);

  // Siblings = all details sharing the same contextId, in document order.
  const siblings = useMemo(() => {
    if (!detail) return [];
    if (!matchData?.criteriaScores) return [detail];
    const result = [];
    for (const cs of matchData.criteriaScores) {
      for (const d of cs.details ?? []) {
        if (detail.contextId != null) {
          if (d.contextId === detail.contextId) result.push(d);
        } else if (detail.context && d.contextId == null && d.context === detail.context) {
          result.push(d);
        }
      }
    }
    return result.length > 0 ? result : [detail];
  }, [detail, matchData?.criteriaScores]);
  const anchorDetailId = siblings[0]?.id ?? null;

  // Sync carousel index to whichever sibling matches the incoming `detail` prop
  // (sidebar click → jump to that sibling; editor tag click → first sibling).
  useEffect(() => {
    if (!detail || siblings.length === 0) return;
    const idx = siblings.findIndex((s) => s.id === detail.id);
    setActiveIdx(idx >= 0 ? idx : 0);
  }, [detail?.id, siblings]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) {
      scrolledForDetailRef.current = null;
    }
    if (!open || !detail || !popoverRef.current) return undefined;

    const popover = popoverRef.current;
    const resetPosition = () => {
      popover.style.top = '';
      popover.style.left = '';
    };

    if (!anchorDetailId) {
      resetPosition();
      return undefined;
    }

    // Mixed tags share a wrapper whose data-detail-id reflects only the first
    // badge — query the badge directly first.
    const badgeEl = document.querySelector(
      `.suggestion-tag__badge[data-detail-id="${anchorDetailId}"]`
    );
    const tagEl =
      badgeEl?.closest('.suggestion-tag') ||
      document.querySelector(`.suggestion-tag[data-detail-id="${anchorDetailId}"]`);
    if (!tagEl) {
      resetPosition();
      return undefined;
    }

    const editorScroller = tagEl.closest('.overflow-y-auto');
    if (!editorScroller) {
      resetPosition();
      return undefined;
    }

    // Anchor on the highlighted text span, not the badge (which floats 26px
    // above the text and would cause the popover to overlap the highlight).
    const highlightEl = editorScroller.querySelector(
      `.suggestion-highlight[data-detail-id*="${anchorDetailId}"]`
    );
    const anchorEl = highlightEl || badgeEl || tagEl;

    // Only scroll into view the first time we open this modal for a given
    // detail. Re-running positioning (e.g. after a state update) shouldn't
    // re-scroll and disrupt the user.
    // Native scrollIntoView({behavior:'smooth'}) stutters on the Tiptap-heavy
    // container; rAF easing on scrollTop gives a consistently smooth result.
    if (scrolledForDetailRef.current !== anchorDetailId) {
      scrolledForDetailRef.current = anchorDetailId;
      const anchorRect = anchorEl.getBoundingClientRect();
      const sRect = editorScroller.getBoundingClientRect();
      const targetTop =
        editorScroller.scrollTop +
        (anchorRect.top - sRect.top) -
        (editorScroller.clientHeight - anchorRect.height) / 2;
      const startTop = editorScroller.scrollTop;
      const maxTop = editorScroller.scrollHeight - editorScroller.clientHeight;
      const clampedTarget = Math.max(0, Math.min(maxTop, targetTop));
      const distance = clampedTarget - startTop;
      if (Math.abs(distance) > 1) {
        const duration = Math.min(450, 200 + Math.abs(distance) * 0.4);
        const startTime = performance.now();
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
        const step = (now) => {
          const t = Math.min(1, (now - startTime) / duration);
          editorScroller.scrollTop = startTop + distance * easeOutCubic(t);
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }

    const hlRect = anchorEl.getBoundingClientRect();
    const scrollerRect = editorScroller.getBoundingClientRect();

    const popoverHeight = popover.offsetHeight || 400;
    // Reserve space for the badge that floats above the highlighted text.
    const BADGE_OFFSET = 26;
    const GAP = 8;
    const spaceAbove = hlRect.top - scrollerRect.top - BADGE_OFFSET;
    const spaceBelow = scrollerRect.bottom - hlRect.bottom;
    const placeAbove = spaceAbove >= popoverHeight + GAP || spaceAbove >= spaceBelow;

    const top = placeAbove
      ? hlRect.top - scrollerRect.top + editorScroller.scrollTop - popoverHeight - GAP - BADGE_OFFSET
      : hlRect.bottom - scrollerRect.top + editorScroller.scrollTop + GAP;
    const left = Math.max(8, hlRect.left - scrollerRect.left);
    const maxLeft = scrollerRect.width - 580;

    popover.style.top = `${Math.max(8, top)}px`;
    popover.style.left = `${Math.min(left, maxLeft)}px`;

    return resetPosition;
  }, [open, detail, anchorDetailId]);

  // Delayed attach so the opening click itself doesn't close the modal.
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
  const activeDetail = activeSibling ?? detail;
  const hasSuggestions = Array.isArray(activeDetail.suggestions) && activeDetail.suggestions.length > 0;
  const isPositiveStatus =
    activeDetail.isFixed || activeDetail.status === 'MATCHED' || activeDetail.status === 'FIXED';
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
    const firstSuggestion = activeDetail.suggestions?.[0]?.suggestion;
    if (!firstSuggestion || !applySuggestion || !activeDetail.context) return;

    setIsApplying(true);
    // Close before the apply pipeline runs — its editor re-render, badge
    // recolor and decoration rebuilds cause visible jitter if the modal stays.
    onClose();
    await applySuggestion({
      detailId: activeDetail.id,
      context: activeDetail.context,
      suggestionText: firstSuggestion,
      detailIds: siblings.map((s) => s.id),
    });
    setIsApplying(false);
  };

  return (
    <div
      ref={popoverRef}
      data-testid="highlight-detail-modal"
      className="absolute z-50 w-[580px] rounded-lg border border-neutral-200 bg-white shadow-xl"
      style={{ maxHeight: 400 }}
    >
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-2.5">
        <span className="text-base font-bold text-neutral-900">Suggestion Preview</span>
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
            itemKey={activeDetail.id}
            suggestions={activeDetail.suggestions}
            isFocused={false}
            compact
            canRegenerate={canRegenerate}
            regeneratingSuggestionId={regeneratingSuggestionId}
            onRegenerateSuggestion={handleRegenerateSuggestion}
            context={activeDetail.context}
            detailId={activeDetail.id}
            allDetailIds={siblings.map((s) => s.id)}
          />
        )}
      </div>

      <div className="flex items-center justify-end border-t border-neutral-100 px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded px-3 py-1.5 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-100"
          >
            Cancel
          </button>
          {!isPositiveStatus && (
            <button
              type="button"
              disabled={isApplying || !hasSuggestions}
              onClick={handleApply}
              className="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApplying ? 'Applying...' : 'Apply'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HighlightDetailModal;
