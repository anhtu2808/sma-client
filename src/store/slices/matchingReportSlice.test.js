import reducer, {
  setDetailContext,
  setDetailFixed,
  setDetailPinnedRange,
  setDetailUnfixed,
  updateSuggestion,
} from "./matchingReportSlice";

const createState = () => ({
  data: {
    criteriaScores: [
      {
        id: 1,
        details: [
          {
            id: 10,
            isFixed: false,
            context: "Original resume text",
            pinnedRange: null,
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

  it("merges full regenerated suggestion metadata while preserving client-only apply state", () => {
    const state = createState();
    state.data.criteriaScores[0].details[0].suggestions[0] = {
      id: 101,
      suggestion: "Old suggestion",
      suggestionType: "REWRITE",
      isApplied: true,
    };

    const nextState = reducer(
      state,
      updateSuggestion({
        id: 101,
        suggestion: "New suggestion",
        targetSection: "EXPERIENCE",
        suggestionType: "EXTEND",
        resolutionType: "ACTIONABLE",
        coveredLabels: ["Docker"],
      })
    );

    expect(nextState.data.criteriaScores[0].details[0].suggestions[0]).toEqual({
      id: 101,
      suggestion: "New suggestion",
      targetSection: "EXPERIENCE",
      suggestionType: "EXTEND",
      resolutionType: "ACTIONABLE",
      coveredLabels: ["Docker"],
      isApplied: true,
    });
  });

  it("setDetailFixed sets isFixed to true", () => {
    const nextState = reducer(createState(), setDetailFixed({ detailId: 10 }));

    expect(nextState.data.criteriaScores[0].details[0].isFixed).toBe(true);
  });

  it("restores context and pinned range when an applied fix is rolled back", () => {
    const appliedState = createState();
    appliedState.data.criteriaScores[0].details[0] = {
      ...appliedState.data.criteriaScores[0].details[0],
      isFixed: true,
      context: "Applied suggestion text",
      pinnedRange: { from: 12, to: 28 },
    };

    let nextState = reducer(appliedState, setDetailUnfixed({ detailId: 10 }));
    nextState = reducer(
      nextState,
      setDetailContext({ detailId: 10, context: "Original resume text" })
    );
    nextState = reducer(
      nextState,
      setDetailPinnedRange({ detailId: 10, range: null })
    );

    expect(nextState.data.criteriaScores[0].details[0]).toEqual(
      expect.objectContaining({
        isFixed: false,
        context: "Original resume text",
        pinnedRange: null,
      })
    );
  });
});
