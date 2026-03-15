import {
  getEvaluationHistoryId,
  getEvaluationHistoryScore,
  getResumeMatchMode,
} from "./matchHistory";

describe("check-match modal history helpers", () => {
  it("returns new mode when a resume has no evaluation history", () => {
    const resume = { id: 12, evaluationHistory: null };

    expect(getEvaluationHistoryId(resume)).toBeNull();
    expect(getEvaluationHistoryScore(resume)).toBeNull();
    expect(getResumeMatchMode(resume)).toBe("new");
  });

  it("returns existing mode and score when history is available", () => {
    const resume = {
      id: 22,
      evaluationHistory: {
        id: 101,
        overallScore: 84.5,
      },
    };

    expect(getEvaluationHistoryId(resume)).toBe(101);
    expect(getEvaluationHistoryScore(resume)).toBe(84.5);
    expect(getResumeMatchMode(resume)).toBe("existing");
  });

  it("keeps existing mode even when history score is null", () => {
    const resume = {
      id: 32,
      evaluationHistory: {
        id: 102,
        overallScore: null,
      },
    };

    expect(getEvaluationHistoryId(resume)).toBe(102);
    expect(getEvaluationHistoryScore(resume)).toBeNull();
    expect(getResumeMatchMode(resume)).toBe("existing");
  });
});
