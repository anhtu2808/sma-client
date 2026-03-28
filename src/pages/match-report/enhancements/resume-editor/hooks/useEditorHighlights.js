import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

/**
 * Syncs Redux matchingReport detail items → ProseMirror decorations
 * and handles scroll-to-focus when focusedItemId changes.
 */
const useEditorHighlights = (editor) => {
  const criteriaScores = useSelector(
    (state) => state.matchingReport.data?.criteriaScores
  );
  const focusedItemId = useSelector(
    (state) => state.matchingReport.ui?.focusedItemId
  );
  const prevFocusedRef = useRef(null);

  // Build and apply highlight decorations whenever data or focusedItemId changes
  useEffect(() => {
    if (!editor || !criteriaScores) return;

    const highlights = [];

    for (const criteria of criteriaScores) {
      if (!Array.isArray(criteria.details)) continue;

      for (const detail of criteria.details) {
        if (!detail.context) continue;

        const isPositive =
          detail.isFixed ||
          detail.status === 'MATCHED' ||
          detail.status === 'matched' ||
          detail.status === 'FIXED' ||
          detail.status === 'fixed';

        highlights.push({
          detailId: detail.id,
          context: detail.context,
          status: isPositive ? 'MATCHED' : detail.status,
          isFocused: detail.id === focusedItemId,
          label: detail.label,
        });
      }
    }

    editor.commands.setHighlights(highlights);
  }, [editor, criteriaScores, focusedItemId]);

  // Scroll-to-focus when focusedItemId changes
  useEffect(() => {
    if (!editor || !focusedItemId || focusedItemId === prevFocusedRef.current) {
      prevFocusedRef.current = focusedItemId;
      return;
    }
    prevFocusedRef.current = focusedItemId;

    // Small delay to let decorations render in DOM
    const timer = setTimeout(() => {
      const el = document.querySelector(
        `[data-detail-id="${focusedItemId}"]`
      );
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [editor, focusedItemId]);
};

export default useEditorHighlights;
