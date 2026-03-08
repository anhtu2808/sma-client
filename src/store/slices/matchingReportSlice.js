import { createSlice } from "@reduxjs/toolkit";

const createInitialState = () => ({
  activeCriteriaId: 1,
  expandedItemIds: [],
  activeDocumentTab: "resume",
  criteria: [
    {
      id: 1,
      name: "Hard Skills",
      aiScore: 60,
      details: [
        {
          id: 101,
          label: "Software Development",
          status: "fixed",
          suggestions: [
            "Applied Software Development best practices to design, build, and maintain scalable web applications.",
          ],
        },
        {
          id: 102,
          label: "Information technology",
          status: "fixed",
        },
        {
          id: 103,
          label: "Node.js (Express/Nest.js)",
          status: "missing",
          suggestions: [
            "Undertake hands-on projects using Node.js with Express or Nest.js, ideally building RESTful APIs.",
          ],
        },
        {
          id: 104,
          label: "AI development tools (Claude, GitHub Copilot)",
          status: "missing",
        },
      ],
    },
    {
      id: 2,
      name: "Soft Skills",
      aiScore: 65,
      details: [
        {
          id: 201,
          label: "Communication",
          status: "fixed",
        },
        {
          id: 202,
          label: "Leadership",
          status: "missing",
          suggestions: [
            "Listed under soft skills, but no specific example of team leadership or mentoring provided in work experience.",
          ],
        },
      ],
    },
    {
      id: 3,
      name: "Experience",
      aiScore: 65,
      details: [
        {
          id: 301,
          label: "Full-Stack Developer at SAT Chasedream",
          status: "matched",
          suggestions: [
            "Designed and developed a multi-tenant LMS platform specialized for Digital SAT preparation.",
          ],
        },
        {
          id: 302,
          label: "4+ years of software development experience",
          status: "missing",
          suggestions: [
            "Total professional experience is approximately 2.5 years, which is below the 4+ years required for the role.",
          ],
        },
      ],
    },
    {
      id: 4,
      name: "Education",
      aiScore: 100,
      details: [
        {
          id: 401,
          label: "Bachelor’s degree in Software Engineering from FPT University",
          status: "matched",
        },
      ],
    },
    {
      id: 5,
      name: "Job Title",
      aiScore: 70,
      details: [
        {
          id: 501,
          label: "Full-Stack Developer",
          status: "matched",
        },
      ],
    },
    {
      id: 6,
      name: "Job Level",
      aiScore: 55,
      details: [
        {
          id: 601,
          label: "Senior-level Leadership",
          status: "missing",
          suggestions: [
            "No evidence of leading teams, mentoring junior developers, or making architectural decisions at a senior level.",
          ],
        },
      ],
    },
  ],
});

const matchingReportSlice = createSlice({
  name: "matchingReport",
  initialState: createInitialState(),
  reducers: {
    resetMatchingReportState: () => createInitialState(),
    setActiveCriteriaId: (state, action) => {
      state.activeCriteriaId = action.payload;
      state.expandedItemIds = [];
    },
    toggleExpandedItemId: (state, action) => {
      const id = action.payload;
      if (state.expandedItemIds.includes(id)) {
        state.expandedItemIds = state.expandedItemIds.filter((item) => item !== id);
        return;
      }

      state.expandedItemIds.push(id);
    },
    setActiveDocumentTab: (state, action) => {
      state.activeDocumentTab = action.payload;
    },
  },
});

export const {
  resetMatchingReportState,
  setActiveCriteriaId,
  toggleExpandedItemId,
  setActiveDocumentTab,
} = matchingReportSlice.actions;

export default matchingReportSlice.reducer;

