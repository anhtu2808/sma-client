import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  setDetailContext,
  setDetailPinnedRange,
  setDetailUnfixed,
  revertScoresAfterUnfixed,
} from '@/store/slices/matchingReportSlice';
import { useUnmarkDetailAsFixedMutation } from '@/apis/matchingApi';

/**
 * Manages a fix-undo stack so that native editor undo rolls back both the editor
 * text change and the "mark as fixed" side effects once the document returns to
 * the exact pre-fix snapshot.
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
export const reconcileFixUndoStack = ({
  currentDoc,
  fixUndoStack,
  dispatch,
  unmarkDetailAsFixed,
}) => {
  if (!currentDoc || !Array.isArray(fixUndoStack) || fixUndoStack.length === 0) {
    return false;
  }

  let didReconcile = false;

  while (fixUndoStack.length > 0) {
    const top = fixUndoStack[fixUndoStack.length - 1];
    if (!top?.beforeDoc || !currentDoc.eq(top.beforeDoc)) {
      break;
    }

    fixUndoStack.pop();
    didReconcile = true;

    top.detailIds.forEach((id) => dispatch(setDetailUnfixed({ detailId: id })));

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

    top.detailIds.forEach((id) => unmarkDetailAsFixed({ detailId: id }));
  }

  return didReconcile;
};

const useFixUndoStack = (editor) => {
  const dispatch = useDispatch();
  const [unmarkDetailAsFixed] = useUnmarkDetailAsFixedMutation();
  const fixUndoStackRef = useRef([]);

  useEffect(() => {
    if (!editor) return;

    const handleTransaction = ({ transaction }) => {
      // Only reconcile on native history UNDO transactions. Ignore redo,
      // selection changes, decoration updates (setHighlights), focus changes, etc.
      const historyMeta = transaction.getMeta('history$');
      if (!historyMeta || historyMeta.redo) return;

      reconcileFixUndoStack({
        currentDoc: editor.state.doc,
        fixUndoStack: fixUndoStackRef.current,
        dispatch,
        unmarkDetailAsFixed,
      });
    };

    editor.on('transaction', handleTransaction);
    return () => editor.off('transaction', handleTransaction);
  }, [editor, dispatch, unmarkDetailAsFixed]);

  const pushFixUndo = useCallback((entry) => {
    fixUndoStackRef.current.push(entry);
  }, []);

  return { pushFixUndo };
};

export default useFixUndoStack;
