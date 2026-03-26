import reducer, { setDetailFixed, updateSuggestion } from "./matchingReportSlice";

const createState = () => ({
  data: {
    criteriaScores: [
      {
        id: 1,
        details: [
          {
            id: 10,
            isFixed: false,
            suggestions: [
              { id: 101, suggestion: "Old suggestion" },
              { id: 102, suggestion: "Keep this one" },
            ],
          },
        ],
      },
    ],
  },
  ui: {
    activeCriteriaId: 1,
    focusedItemId: null,
    expandedItemIds: [],
    activeDocumentTab: "resume",
  },
});

describe("matchingReportSlice", () => {
  it("updates the matching suggestion by id", () => {
    const nextState = reducer(
      createState(),
      updateSuggestion({ id: 101, suggestion: "New suggestion" })
    );

    expect(nextState.data.criteriaScores[0].details[0].suggestions).toEqual([
      { id: 101, suggestion: "New suggestion" },
      { id: 102, suggestion: "Keep this one" },
    ]);
  });

  it("setDetailFixed sets isFixed to true", () => {
    const nextState = reducer(createState(), setDetailFixed({ detailId: 10 }));

    expect(nextState.data.criteriaScores[0].details[0].isFixed).toBe(true);
  });
});
