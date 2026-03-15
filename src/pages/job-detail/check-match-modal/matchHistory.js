export const getEvaluationHistoryId = (resume) => {
  const id = Number.parseInt(`${resume?.evaluationHistory?.id ?? ""}`, 10);
  return Number.isFinite(id) ? id : null;
};

export const getEvaluationHistoryScore = (resume) => {
  const rawScore = resume?.evaluationHistory?.overallScore;
  if (rawScore == null || rawScore === "") {
    return null;
  }

  const score = Number(rawScore);
  return Number.isFinite(score) ? score : null;
};

export const getResumeMatchMode = (resume) =>
  getEvaluationHistoryId(resume) != null ? "existing" : "new";
