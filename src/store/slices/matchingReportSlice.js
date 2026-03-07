import { createSlice } from "@reduxjs/toolkit";

const createInitialState = () => ({
  activeSidebarTab: "skills",
  expandedSidebarKeys: [],
  activeDocumentTab: "resume",
});

const matchingReportSlice = createSlice({
  name: "matchingReport",
  initialState: createInitialState(),
  reducers: {
    resetMatchingReportState: () => createInitialState(),
    setActiveSidebarTab: (state, action) => {
      state.activeSidebarTab = action.payload;
      state.expandedSidebarKeys = [];
    },
    toggleExpandedSidebarKey: (state, action) => {
      const key = action.payload;
      if (state.expandedSidebarKeys.includes(key)) {
        state.expandedSidebarKeys = state.expandedSidebarKeys.filter((item) => item !== key);
        return;
      }

      state.expandedSidebarKeys.push(key);
    },
    setActiveDocumentTab: (state, action) => {
      state.activeDocumentTab = action.payload;
    },
  },
});

export const {
  resetMatchingReportState,
  setActiveSidebarTab,
  toggleExpandedSidebarKey,
  setActiveDocumentTab,
} = matchingReportSlice.actions;

export default matchingReportSlice.reducer;
