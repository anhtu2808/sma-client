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
    
    setFocusedItemId: (state, action) => {
      state.ui.focusedItemId = action.payload;
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
  },
});

export const {
  resetMatchingReportState,
  setMatchingReportData,
  setActiveCriteriaId,
  setFocusedItemId,
  toggleExpandedItemId,
  setActiveDocumentTab,
  toggleDetailFixed,
} = matchingReportSlice.actions;

export default matchingReportSlice.reducer;
