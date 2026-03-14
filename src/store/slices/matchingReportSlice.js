import { createSlice } from "@reduxjs/toolkit";

const createInitialState = () => ({
  data: null,
  ui: {
    activeCriteriaId: null,
    focusedItemId: null,
    expandedItemIds: [],
    activeDocumentTab: "resume",
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

    toggleDetailFixed: (state, action) => {
      const { detailId } = action.payload;
      if (!state.data) return;

      state.data.criteriaScores.forEach((criteria) => {
        const detail = criteria.details.find((d) => d.id === detailId);
        if (detail) {
          detail.isFixed = !detail.isFixed;
        }
      });
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
  setFocusedItemId,
  focusItemWithTabSwitch,
  toggleExpandedItemId,
  expandItemId,
  setActiveDocumentTab,
  toggleDetailFixed,
  updateSuggestion,
} = matchingReportSlice.actions;

export default matchingReportSlice.reducer;
