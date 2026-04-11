import { mapEvaluationToStore, mapSuggestionsToStore } from "./matchingReportUtils";

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

describe("mapSuggestionsToStore", () => {
  it("uses contexts as the primary source for enhancement-step statuses", () => {
    const state = mapSuggestionsToStore({
      evaluationId: 10,
      jobId: 20,
      jobName: "Backend Engineer",
      resumeId: 30,
      resumeFullName: "Jane Doe",
      aiOverallScore: 76,
      criteriaScores: [
        {
          id: 501,
          details: [],
        },
      ],
      contexts: [
        {
          id: 9001,
          context: "Spring Boot microservices",
          suggestions: [],
          details: [
            {
              id: 1,
              evaluationCriteriaScoreId: 501,
              scoringCriteriaId: 101,
              criteriaName: "Hard Skills",
              label: "Spring Boot",
              status: "MATCHED",
              description: "Already matched",
              requiredLevel: "MID",
              candidateLevel: "MID",
              isRequired: true,
              impactScore: 12,
              isFixed: false,
            },
          ],
        },
        {
          id: 9002,
          context: "Kafka event streaming",
          suggestions: [{ id: 77, suggestion: "Added Kafka-based event streaming" }],
          details: [
            {
              id: 2,
              evaluationCriteriaScoreId: 501,
              scoringCriteriaId: 101,
              criteriaName: "Hard Skills",
              label: "Kafka",
              status: "PARTIAL",
              description: "Need stronger evidence",
              requiredLevel: "MID",
              candidateLevel: "JUNIOR",
              isRequired: true,
              impactScore: 18,
              isFixed: false,
            },
          ],
        },
      ],
    });

    expect(state.data.criteriaScores[0].details).toEqual([
      expect.objectContaining({
        id: 1,
        status: "MATCHED",
        context: "Spring Boot microservices",
        suggestions: [],
      }),
      expect.objectContaining({
        id: 2,
        status: "PARTIAL",
        context: "Kafka event streaming",
        suggestions: [{ id: 77, suggestion: "Added Kafka-based event streaming" }],
      }),
    ]);
  });
});
