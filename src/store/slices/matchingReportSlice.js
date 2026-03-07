import { createSlice } from "@reduxjs/toolkit";

const createInitialState = () => ({
  activeSidebarTab: "skills",
  expandedSidebarKeys: [],
  activeDocumentTab: "resume",
  sidebarTabs: [
    { key: "skills", label: "Skills", progress: 40 },
    { key: "searchability", label: "Searchability", progress: 60 },
    { key: "recruiterTips", label: "Recruiter Tips", progress: 30 },
  ],
  sidebarContentByTab: {
    skills: [
      {
        key: "required-skills",
        title: "Required skills",
        metrics: [{ label: "Matched skills", value: 1, tone: "success" }],
        items: [
          {
            key: "javascript",
            label: "Javascript",
            status: "matched",
            progressLabel: "Added 2/2",
            asTag: true,
          },
        ],
      },
      {
        key: "hard-skills",
        title: "Hard skills",
        metrics: [
          { label: "Matched skills", value: 4, tone: "success" },
          { label: "Missing skills", value: 1, tone: "danger" },
        ],
        items: [
          {
            key: "software-development",
            label: "Software Development",
            status: "matched",
            progressLabel: "Added 4/2",
            asTag: true,
            suggestions: [
              "Applied Software Development best practices to design, build, and maintain scalable web applications.",
              "Contributed to the full Software Development lifecycle, from concept to deployment, for diverse projects.",
              "Leveraged Software Development expertise to create robust and efficient user-facing features.",
            ],
          },
          {
            key: "information-technology",
            label: "Information technology",
            status: "matched",
            progressLabel: "Added 1/1",
            asTag: true,
          },
          {
            key: "information-systems",
            label: "Information Systems",
            status: "matched",
            progressLabel: "Added 1/1",
            asTag: true,
          },
          {
            key: "recruitment",
            label: "Recruitment",
            status: "missing",
            progressLabel: "0/1",
            asTag: false,
          },
          {
            key: "hcm",
            label: "HCM",
            status: "matched",
            progressLabel: "1/1",
            asTag: false,
          },
        ],
      },
    ],
    searchability: [
      {
        key: "keyword-density",
        title: "Keyword density",
        metrics: [
          { label: "Matched keywords", value: 3, tone: "success" },
          { label: "Missing keywords", value: 2, tone: "danger" },
        ],
        items: [
          {
            key: "action-verbs",
            label: "Action verbs",
            status: "matched",
            progressLabel: "11/12",
            asTag: true,
          },
          {
            key: "impact-numbers",
            label: "Impact numbers",
            status: "missing",
            progressLabel: "2/6",
            asTag: false,
            suggestions: [
              "Add measurable outcomes in each role, such as conversion uplift or cycle-time reduction.",
              "Include metrics for API performance, deployment frequency, and bug-fix turnaround.",
              "Quantify project scope: users served, services managed, or automation savings.",
            ],
          },
          {
            key: "role-keywords",
            label: "Role-specific keywords",
            status: "matched",
            progressLabel: "8/10",
            asTag: true,
          },
        ],
      },
      {
        key: "ats-formatting",
        title: "ATS formatting",
        metrics: [{ label: "Checklist passed", value: 5, tone: "success" }],
        items: [
          {
            key: "heading-structure",
            label: "Heading structure",
            status: "matched",
            progressLabel: "Ready",
            asTag: false,
          },
          {
            key: "readability",
            label: "Readability score",
            status: "matched",
            progressLabel: "Good",
            asTag: false,
          },
        ],
      },
    ],
    recruiterTips: [
      {
        key: "priority-feedback",
        title: "Recruiter tips",
        metrics: [{ label: "Open items", value: 6, tone: "danger" }],
        items: [
          {
            key: "summary-focus",
            label: "Strengthen profile summary",
            status: "missing",
            progressLabel: "High priority",
            asTag: false,
            suggestions: [
              "Start summary with your strongest role-fit statement and 3-4 years equivalent project exposure.",
              "Emphasize ownership scope for backend APIs, frontend delivery, and CI/CD pipeline automation.",
            ],
          },
          {
            key: "project-depth",
            label: "Deepen project outcomes",
            status: "missing",
            progressLabel: "High priority",
            asTag: false,
            suggestions: [
              "For each project, add impact before tech stack to improve recruiter scan speed.",
              "Highlight collaboration with product, QA, and cross-functional teams.",
            ],
          },
          {
            key: "language-consistency",
            label: "Keep wording consistent",
            status: "matched",
            progressLabel: "In progress",
            asTag: false,
          },
        ],
      },
    ],
  },
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

