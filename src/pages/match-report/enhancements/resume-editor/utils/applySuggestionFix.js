import { getErrorMessage } from '@/constant/attachment';
import {
  setDetailContext,
  setDetailFixed,
  setDetailPinnedRange,
  setFocusedItemId,
  updateScoresAfterFixed,
} from '@/store/slices/matchingReportSlice';
import toastMessage from '@/utils/toastMessage';
import { stripHtml } from './prosemirrorSearch';

const FOCUS_DURATION_MS = 2500;

const getCriteriaScoreForDetail = (criteriaScores, detailId) => {
  for (const criteriaScore of criteriaScores ?? []) {
    if (criteriaScore.details?.some((detail) => detail.id === detailId)) {
      return criteriaScore;
    }
  }
  return null;
};

const getDetailById = (criteriaScores, detailId) =>
  (criteriaScores ?? []).flatMap((criteriaScore) => criteriaScore.details ?? []).find((detail) => detail.id === detailId);

export const applySuggestionFix = async ({
  detailId,
  context,
  suggestionText,
  detailIds,
  editor,
  enhancementId,
  matchData,
  fixInEditor,
  markDetailAsFixedBatch,
  dispatch,
  pushFixUndo,
}) => {
  if (!detailId || !context || !suggestionText || !fixInEditor || !markDetailAsFixedBatch) {
    return { success: false, statusUpdated: false };
  }

  const idsToMark = Array.isArray(detailIds) && detailIds.length > 0 ? detailIds : [detailId];
  const beforeDoc = editor?.state?.doc ?? null;
  const beforeOverallScore = matchData?.aiOverallScore;
  const beforeCriteriaScore = getCriteriaScoreForDetail(matchData?.criteriaScores, detailId)?.aiScore;
  const originalPinnedRanges = Object.fromEntries(
    idsToMark.map((id) => [id, getDetailById(matchData?.criteriaScores, id)?.pinnedRange ?? null])
  );

  const result = await fixInEditor(context, suggestionText, detailId);
  const success = result?.success;
  const pinnedRange = result?.range ?? null;

  if (!success) {
    return { success: false, statusUpdated: false };
  }

  const plainSuggestion = stripHtml(suggestionText);
  idsToMark.forEach((id) => {
    dispatch(setDetailContext({ detailId: id, context: plainSuggestion }));
    dispatch(setDetailPinnedRange({ detailId: id, range: pinnedRange }));
  });

  try {
    const content = editor?.getHTML?.();
    const response = await markDetailAsFixedBatch({
      detailIds: idsToMark,
      enhancementId,
      content,
    }).unwrap();

    idsToMark.forEach((id) => {
      dispatch(setDetailFixed({ detailId: id }));
    });

    if (response) {
      dispatch(
        updateScoresAfterFixed({
          afterOverallScore: response.afterOverallScore,
          criteriaScoreId: response.criteriaScoreId,
          afterCriteriaScore: response.afterCriteriaScore,
        })
      );
    }

    if (beforeDoc && pushFixUndo) {
      pushFixUndo({
        beforeDoc,
        detailIds: idsToMark,
        criteriaScoreId: response?.criteriaScoreId,
        beforeOverallScore,
        beforeCriteriaScore,
        originalContext: context,
        originalPinnedRanges,
      });
    }

    toastMessage.success('Fix applied successfully.');
    dispatch(setFocusedItemId(detailId));
    setTimeout(() => dispatch(setFocusedItemId(null)), FOCUS_DURATION_MS);

    return {
      success: true,
      statusUpdated: true,
      detailIds: idsToMark,
      pinnedRange,
      response,
      content,
    };
  } catch (error) {
    toastMessage.error(getErrorMessage(error, 'Fix applied but failed to update status.'));
    return {
      success: true,
      statusUpdated: false,
      detailIds: idsToMark,
      pinnedRange,
      error,
    };
  }
};

export default applySuggestionFix;
