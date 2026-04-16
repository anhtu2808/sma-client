import { createSlice } from "@reduxjs/toolkit";

const createInitialState = () => ({
  data: null,
  ui: {
    activeCriteriaId: null,
    focusedItemId: null,
    expandedItemIds: [],
    activeDocumentTab: "resume",
    highlightModalDetailId: null,
  },
});

const matchingReportSlice = createSlice({
  name: "matchingReport",
  initialState: createInitialState(),
  reducers: {
    resetMatchingReportState: () => createInitialState(),
    setMatchingReportData: (state, action) => {
      if (!action.payload) return;
      state.data = action.payload.data;
      state.ui = action.payload.ui;
    },

    setActiveCriteriaId: (state, action) => {
      state.ui.activeCriteriaId = action.payload;
      state.ui.expandedItemIds = [];
      state.ui.focusedItemId = null;
      state.ui.highlightModalDetailId = null;
    },

    setHighlightModalDetailId: (state, action) => {
      state.ui.highlightModalDetailId = action.payload;
    },

    toggleExpandedItemId: (state, action) => {
      const id = action.payload;
      if (state.ui.expandedItemIds.includes(id)) {
        state.ui.expandedItemIds = state.ui.expandedItemIds.filter((item) => item !== id);
        return;
      }

      state.ui.expandedItemIds.push(id);
    },
    
    expandItemId: (state, action) => {
      const id = action.payload;
      if (!state.ui.expandedItemIds.includes(id)) {
        state.ui.expandedItemIds.push(id);
      }
    },

    setFocusedItemId: (state, action) => {
      state.ui.focusedItemId = action.payload;
    },

    focusItemWithTabSwitch: (state, action) => {
      const detailId = action.payload;
      if (!state.data) return;

      // Find which criteria this detail belongs to
      let parentCriteriaId = null;
      for (const criteria of state.data.criteriaScores) {
        if (criteria.details?.some((d) => d.id === detailId)) {
          parentCriteriaId = criteria.id;
          break;
        }
      }

      if (parentCriteriaId) {
        state.ui.activeCriteriaId = parentCriteriaId;
      }
      
      if (!state.ui.expandedItemIds.includes(detailId)) {
        state.ui.expandedItemIds.push(detailId);
      }
      state.ui.focusedItemId = detailId;
    },

    setActiveDocumentTab: (state, action) => {
      state.ui.activeDocumentTab = action.payload;
    },

    setDetailFixed: (state, action) => {
      const { detailId } = action.payload;
      if (!state.data) return;

      state.data.criteriaScores.forEach((criteria) => {
        const detail = criteria.details.find((d) => d.id === detailId);
        if (detail) {
          detail.isFixed = true;
        }
      });
    },

    setDetailUnfixed: (state, action) => {
      const { detailId } = action.payload;
      if (!state.data) return;

      state.data.criteriaScores.forEach((criteria) => {
        const detail = criteria.details.find((d) => d.id === detailId);
        if (detail) {
          detail.isFixed = false;
        }
      });
    },

    revertScoresAfterUnfixed: (state, action) => {
      // [DISABLED] Score revert — scores no longer change on apply/undo
      // const { beforeOverallScore, criteriaScoreId, beforeCriteriaScore } = action.payload;
      // if (!state.data) return;
      // if (beforeOverallScore !== undefined) {
      //   state.data.aiOverallScore = beforeOverallScore;
      // }
      // if (criteriaScoreId !== undefined && beforeCriteriaScore !== undefined) {
      //   const criteria = state.data.criteriaScores.find((c) => c.id === criteriaScoreId);
      //   if (criteria) {
      //     criteria.aiScore = beforeCriteriaScore;
      //   }
      // }
    },

    setDetailContext: (state, action) => {
      const { detailId, context } = action.payload;
      if (!state.data) return;

      state.data.criteriaScores.forEach((criteria) => {
        const detail = criteria.details.find((d) => d.id === detailId);
        if (detail) {
          detail.context = context;
        }
      });
    },

    setDetailPinnedRange: (state, action) => {
      const { detailId, range } = action.payload;
      if (!state.data) return;

      state.data.criteriaScores.forEach((criteria) => {
        const detail = criteria.details.find((d) => d.id === detailId);
        if (detail) {
          detail.pinnedRange = range || null;
        }
      });
    },

    updateScoresAfterFixed: (state, action) => {
      // [DISABLED] Score recalculation — only track fixed status, don't update scores
      // const { afterOverallScore, criteriaScoreId, afterCriteriaScore } = action.payload;
      // if (!state.data) return;
      // if (afterOverallScore !== undefined) {
      //   state.data.aiOverallScore = afterOverallScore;
      // }
      // if (criteriaScoreId !== undefined && afterCriteriaScore !== undefined) {
      //   const criteria = state.data.criteriaScores.find((c) => c.id === criteriaScoreId);
      //   if (criteria) {
      //     criteria.aiScore = afterCriteriaScore;
      //   }
      // }
    },

    updateSuggestion: (state, action) => {
      const { id, suggestion } = action.payload || {};
      if (!state.data || !Number.isFinite(Number(id)) || typeof suggestion !== "string") return;

      state.data.criteriaScores.forEach((criteria) => {
        criteria.details.forEach((detail) => {
          detail.suggestions.forEach((detailSuggestion) => {
            if (detailSuggestion.id === Number(id)) {
              detailSuggestion.suggestion = suggestion;
            }
          });
        });
      });
    },
  },
});

export const {
  resetMatchingReportState,
  setMatchingReportData,
  setActiveCriteriaId,
  setHighlightModalDetailId,
  setFocusedItemId,
  focusItemWithTabSwitch,
  toggleExpandedItemId,
  expandItemId,
  setActiveDocumentTab,
  setDetailFixed,
  setDetailUnfixed,
  setDetailContext,
  setDetailPinnedRange,
  updateSuggestion,
  updateScoresAfterFixed,
  revertScoresAfterUnfixed,
} = matchingReportSlice.actions;

export default matchingReportSlice.reducer;
