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

  it("preserves full suggestion metadata from backend responses", () => {
    const state = mapEvaluationToStore({
      criteriaScores: [
        {
          id: 9,
          details: [
            {
              id: 1,
              suggestions: [
                {
                  id: 11,
                  suggestion: "Backend suggestion",
                  targetSection: "EXPERIENCE",
                  suggestionType: "EXTEND",
                  resolutionType: "ACTIONABLE",
                  reason: "Adds grounded work-history evidence.",
                  sourceEvidence: "Built APIs on AWS",
                  requiresManualInput: false,
                  coveredLabels: ["Docker"],
                },
              ],
            },
          ],
        },
      ],
    });

    expect(state.data.criteriaScores[0].details[0].suggestions).toEqual([
      expect.objectContaining({
        id: 11,
        suggestion: "Backend suggestion",
        targetSection: "EXPERIENCE",
        suggestionType: "EXTEND",
        resolutionType: "ACTIONABLE",
        reason: "Adds grounded work-history evidence.",
        sourceEvidence: "Built APIs on AWS",
        requiresManualInput: false,
        coveredLabels: ["Docker"],
      }),
    ]);
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
          suggestions: [
            {
              id: 77,
              suggestion: "Added Kafka-based event streaming",
              targetSection: "EXPERIENCE",
              suggestionType: "EXTEND",
              resolutionType: "ACTIONABLE",
              coveredLabels: ["Kafka"],
            },
          ],
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
        tagIndex: 1,
        status: "MATCHED",
        context: "Spring Boot microservices",
        suggestions: [],
      }),
      expect.objectContaining({
        id: 2,
        tagIndex: 1,
        status: "PARTIAL",
        context: "Kafka event streaming",
        suggestions: [
          expect.objectContaining({
            id: 77,
            suggestion: "Added Kafka-based event streaming",
            targetSection: "EXPERIENCE",
            suggestionType: "EXTEND",
            resolutionType: "ACTIONABLE",
            coveredLabels: ["Kafka"],
          }),
        ],
      }),
    ]);
  });

  it("shares the same tagIndex for sibling details in the same backend context", () => {
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
            {
              id: 2,
              evaluationCriteriaScoreId: 501,
              scoringCriteriaId: 102,
              criteriaName: "Hard Skills",
              label: "Microservices",
              status: "PARTIAL",
              description: "Need stronger evidence",
              requiredLevel: "MID",
              candidateLevel: "MID",
              isRequired: true,
              impactScore: 9,
              isFixed: false,
            },
          ],
        },
      ],
    });

    expect(state.data.criteriaScores[0].details).toEqual([
      expect.objectContaining({ id: 1, tagIndex: 2 }),
      expect.objectContaining({ id: 2, tagIndex: 2 }),
    ]);
  });

  it("leaves fallback criteria details without a tagIndex when they are not in response.contexts", () => {
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
          details: [
            {
              id: 3,
              contextId: 9999,
              label: "Java",
              status: "MATCHED",
              description: "Already matched",
              requiredLevel: "MID",
              candidateLevel: "MID",
              isRequired: true,
              isFixed: false,
              context: "Java",
              impactScore: 5,
              suggestions: [],
            },
          ],
        },
      ],
      contexts: [],
    });

    expect(state.data.criteriaScores[0].details).toEqual([
      expect.objectContaining({
        id: 3,
        tagIndex: null,
        context: "Java",
      }),
    ]);
  });
});
