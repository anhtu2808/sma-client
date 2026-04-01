import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Suggestions from '@/pages/match-report/sidebar/content/suggestions';
import { useMarkDetailAsFixedMutation, useRegenerateSuggestionMutation } from '@/apis/matchingApi';
import { setDetailFixed, updateScoresAfterFixed, updateSuggestion } from '@/store/slices/matchingReportSlice';
import { getErrorMessage } from '@/constant/attachment';
import toastMessage from '@/utils/toastMessage';
import EditorContext from '@/pages/match-report/enhancements/EditorContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faThumbsDown, faThumbsUp, faXmark } from '../../../../utils/icons';

const HighlightDetailModal = ({ detail, open, onClose, onFixApplied }) => {
  const dispatch = useDispatch();
  const popoverRef = useRef(null);
  const cleanupRef = useRef(null);
  const [regenerateSuggestion] = useRegenerateSuggestionMutation();
  const [markDetailAsFixed] = useMarkDetailAsFixedMutation();
  const [regeneratingSuggestionId, setRegeneratingSuggestionId] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const { fixInEditor } = useContext(EditorContext);

  // Position popover near the highlight element in the editor
  useEffect(() => {
    if (!open || !detail || !popoverRef.current) return;

    const highlightEl = document.querySelector(`[data-detail-id="${detail.id}"][data-tag="true"]`);
    if (!highlightEl) return;

    const editorScroller = highlightEl.closest('.overflow-y-auto');
    if (!editorScroller) return;

    const hlRect = highlightEl.getBoundingClientRect();
    const scrollerRect = editorScroller.getBoundingClientRect();
    const popover = popoverRef.current;

    // Position below the highlight text
    const top = hlRect.bottom - scrollerRect.top + editorScroller.scrollTop + 8;
    const left = Math.max(8, hlRect.left - scrollerRect.left);
    const maxLeft = scrollerRect.width - 420;

    popover.style.top = `${top}px`;
    popover.style.left = `${Math.min(left, maxLeft)}px`;
  }, [open, detail]);

  // Close on click outside — use pointerdown for reliable detection before DOM mutations
  useEffect(() => {
    if (!open) return;

    let attached = false;

    // Delay attaching to avoid closing from the same click that opened
    const timeoutId = setTimeout(() => {
      attached = true;

      const handlePointerDown = (e) => {
        if (!popoverRef.current) return;
        if (popoverRef.current.contains(e.target)) return;
        // Don't close if clicking a tag (will open a different popover)
        if (e.target.closest?.('[data-tag="true"]')) return;
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

  const hasSuggestions = Array.isArray(detail.suggestions) && detail.suggestions.length > 0;
  const isPositiveStatus = detail.isFixed || detail.status === 'MATCHED' || detail.status === 'FIXED';
  const canRegenerate = !isPositiveStatus;

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

  return (
    <div
      ref={popoverRef}
      className="absolute z-50 w-[400px] rounded-lg border border-neutral-200 bg-white shadow-xl"
      style={{ maxHeight: 400 }}
    >
      {/* Header */}
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

      {/* Content */}
      <div className="max-h-[300px] overflow-y-auto">
        {detail.description && (
          <div className="mx-4 mt-3 mb-1 rounded-md bg-amber-50 border border-amber-100 px-3 py-2">
            <p className="text-sm font-medium text-amber-800 mb-0.5">{detail.label}</p>
            <p className="text-[13px] leading-relaxed text-amber-700">{detail.description}</p>
          </div>
        )}

        {hasSuggestions && (
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
          />
        )}
      </div>

      {/* Footer */}
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
            onClick={async () => {
              const firstSuggestion = detail.suggestions?.[0]?.suggestion;
              if (!firstSuggestion || !fixInEditor || !detail.context) return;

              setIsApplying(true);
              const success = await fixInEditor(detail.context, firstSuggestion, detail.id);
              if (success) {
                try {
                  const response = await markDetailAsFixed({ detailId: detail.id }).unwrap();
                  dispatch(setDetailFixed({ detailId: detail.id }));
                  if (response) {
                    dispatch(updateScoresAfterFixed({
                      afterOverallScore: response.afterOverallScore,
                      criteriaScoreId: response.criteriaScoreId,
                      afterCriteriaScore: response.afterCriteriaScore,
                    }));
                  }
                  toastMessage.success('Fix applied successfully.');
                } catch (error) {
                  toastMessage.error(getErrorMessage(error, 'Fix applied but failed to update status.'));
                }
              }
              setIsApplying(false);
              onClose();
            }}
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
