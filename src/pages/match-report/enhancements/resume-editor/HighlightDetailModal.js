import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Suggestions from '@/pages/match-report/sidebar/content/suggestions';
import { useRegenerateSuggestionMutation } from '@/apis/matchingApi';
import { updateSuggestion } from '@/store/slices/matchingReportSlice';
import { getErrorMessage } from '@/constant/attachment';
import toastMessage from '@/utils/toastMessage';

const HighlightDetailModal = ({ detail, open, onClose, onFixApplied }) => {
  const dispatch = useDispatch();
  const popoverRef = useRef(null);
  const cleanupRef = useRef(null);
  const [regenerateSuggestion] = useRegenerateSuggestionMutation();
  const [regeneratingSuggestionId, setRegeneratingSuggestionId] = useState(null);

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

  // Close on click outside — use mouseup to avoid conflicts with inner clicks
  useEffect(() => {
    if (!open) return;

    // Delay attaching to avoid closing from the same click that opened
    const timeoutId = setTimeout(() => {
      const handleClick = (e) => {
        if (!popoverRef.current) return;
        if (popoverRef.current.contains(e.target)) return;
        // Don't close if clicking a tag (will open a different popover)
        if (e.target.closest('[data-tag="true"]')) return;
        onClose();
      };
      const handleEsc = (e) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('mouseup', handleClick);
      document.addEventListener('keydown', handleEsc);

      // Store for cleanup
      cleanupRef.current = () => {
        document.removeEventListener('mouseup', handleClick);
        document.removeEventListener('keydown', handleEsc);
      };
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      cleanupRef.current?.();
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
          <span className="material-icons-round text-[16px]">close</span>
        </button>
      </div>

      {/* Content */}
      <div className="max-h-[300px] overflow-y-auto">
        {hasSuggestions && (
          <Suggestions
            itemKey={detail.id}
            suggestions={detail.suggestions}
            isFocused={false}
            canRegenerate={canRegenerate}
            regeneratingSuggestionId={regeneratingSuggestionId}
            onRegenerateSuggestion={handleRegenerateSuggestion}
            context={detail.context}
            detailId={detail.id}
          />
        )}

        {!hasSuggestions && detail.description && (
          <p className="px-4 py-3 text-sm leading-relaxed text-neutral-600">{detail.description}</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-2">
        <div className="flex items-center gap-2">
          <button type="button" className="flex h-7 w-7 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600">
            <span className="material-icons-round text-[16px]">autorenew</span>
          </button>
          <button type="button" className="flex h-7 w-7 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600">
            <span className="material-icons-round text-[16px]">thumb_up</span>
          </button>
          <button type="button" className="flex h-7 w-7 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600">
            <span className="material-icons-round text-[16px]">thumb_down</span>
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
            onClick={() => {
              onFixApplied?.();
              onClose();
            }}
            className="rounded bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default HighlightDetailModal;
