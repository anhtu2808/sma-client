import { useEffect, useRef, useState } from 'react';
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
  // Counter bumped on every doc update — lets the effect below re-run and
  // rebuild decorations against the latest document (important after Apply).
  const [docVersion, setDocVersion] = useState(0);

  useEffect(() => {
    if (!editor) return undefined;
    const handler = ({ transaction }) => {
      if (transaction?.docChanged) setDocVersion((v) => v + 1);
    };
    editor.on('update', handler);
    return () => {
      editor.off('update', handler);
    };
  }, [editor]);

  // Build and apply highlight decorations whenever data, focus, or doc changes
  useEffect(() => {
    if (!editor || !criteriaScores) return;

    const highlights = [];
    const seenContextKeys = new Set();

    let focusedContextKey = null;
    if (focusedItemId != null) {
      outer: for (const criteria of criteriaScores) {
        if (!Array.isArray(criteria.details)) continue;
        for (const detail of criteria.details) {
          if (detail.id === focusedItemId) {
            focusedContextKey = detail.contextId != null
              ? `cid:${detail.contextId}`
              : `ctx:${detail.context}`;
            break outer;
          }
        }
      }
    }

    for (const criteria of criteriaScores) {
      if (!Array.isArray(criteria.details)) continue;

      for (const detail of criteria.details) {
        if (!detail.context) continue;

        // Dedupe per context: siblings share one highlight.
        const ctxKey = detail.contextId != null ? `cid:${detail.contextId}` : `ctx:${detail.context}`;
        if (seenContextKeys.has(ctxKey)) continue;
        seenContextKeys.add(ctxKey);

        const isPositive =
          detail.isFixed ||
          detail.status === 'MATCHED' ||
          detail.status === 'matched' ||
          detail.status === 'FIXED' ||
          detail.status === 'fixed';

        highlights.push({
          detailId: detail.id,
          context: detail.context,
          pinnedRange: detail.pinnedRange || null,
          status: isPositive ? 'MATCHED' : detail.status,
          isFocused: ctxKey === focusedContextKey,
          label: detail.label,
        });
      }
    }

    editor.commands.setHighlights(highlights);
  }, [editor, criteriaScores, focusedItemId, docVersion]);

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
