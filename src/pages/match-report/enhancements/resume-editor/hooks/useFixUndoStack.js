import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  setDetailUnfixed,
  setDetailContext,
  setDetailPinnedRange,
  revertScoresAfterUnfixed,
} from '@/store/slices/matchingReportSlice';
import { useUnmarkDetailAsFixedMutation } from '@/apis/matchingApi';

/**
 * Manages a fix-undo stack so that Ctrl+Z rolls back both the editor text change
 * AND the "mark as fixed" state (Redux + backend).
 *
 * Stack entry shape:
 *   { beforeDoc, detailIds, criteriaScoreId, beforeOverallScore, beforeCriteriaScore, originalPinnedRanges }
 *
 * - beforeDoc: ProseMirror Node captured before fixInEditor was called
 * - detailIds: array of detail IDs that were marked as fixed in that apply action
 * - criteriaScoreId: the criteria score ID (for score revert)
 * - beforeOverallScore: aiOverallScore before the fix
 * - beforeCriteriaScore: criteria aiScore before the fix
 */
const useFixUndoStack = (editor) => {
  const dispatch = useDispatch();
  const [unmarkDetailAsFixed] = useUnmarkDetailAsFixedMutation();
  const fixUndoStackRef = useRef([]);

  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (e) => {
      const isUndo = (e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === 'z';
      if (!isUndo || !editor.view.hasFocus()) return;

      // Run undo in the editor ourselves (synchronous)
      const didUndo = editor.commands.undo();

      // Prevent Tiptap / browser from running undo a second time
      e.preventDefault();
      e.stopImmediatePropagation();

      if (!didUndo || fixUndoStackRef.current.length === 0) return;

      // Check whether the undo just restored the exact pre-fix document state
      const top = fixUndoStackRef.current[fixUndoStackRef.current.length - 1];
      if (!editor.state.doc.eq(top.beforeDoc)) return;

      fixUndoStackRef.current.pop();

      // Revert Redux state immediately (optimistic)
      top.detailIds.forEach((id) => dispatch(setDetailUnfixed({ detailId: id })));
      // Restore original context so the highlight decoration can find the text again
      if (top.originalContext) {
        top.detailIds.forEach((id) =>
          dispatch(setDetailContext({ detailId: id, context: top.originalContext }))
        );
      }
      top.detailIds.forEach((id) =>
        dispatch(setDetailPinnedRange({ detailId: id, range: top.originalPinnedRanges?.[id] ?? null }))
      );
      dispatch(
        revertScoresAfterUnfixed({
          beforeOverallScore: top.beforeOverallScore,
          criteriaScoreId: top.criteriaScoreId,
          beforeCriteriaScore: top.beforeCriteriaScore,
        })
      );

      // Persist to backend (fire-and-forget — failures are non-critical)
      top.detailIds.forEach((id) => unmarkDetailAsFixed({ detailId: id }));
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [editor, dispatch, unmarkDetailAsFixed]);

  const pushFixUndo = useCallback((entry) => {
    fixUndoStackRef.current.push(entry);
  }, []);

  return { pushFixUndo };
};

export default useFixUndoStack;
