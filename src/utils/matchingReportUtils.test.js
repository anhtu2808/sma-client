import { mapEvaluationToStore } from "./matchingReportUtils";

describe("mapEvaluationToStore", () => {
  it("normalizes backend suggestion objects and empty values", () => {
    const state = mapEvaluationToStore({
      criteriaScores: [
        {
          id: 9,
          details: [
            {
              id: 1,
              suggestions: [{ id: 11, suggestion: "Backend suggestion" }],
            },
            {
              id: 2,
              suggestions: null,
            },
          ],
        },
      ],
    });

    expect(state.data.criteriaScores[0].details[0].suggestions).toEqual([
      { id: 11, suggestion: "Backend suggestion" },
    ]);
    expect(state.data.criteriaScores[0].details[1].suggestions).toEqual([]);
  });
});
