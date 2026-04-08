export const getEvaluationHistoryId = (resume) => {
  const id = Number.parseInt(`${resume?.evaluationHistory?.id ?? ""}`, 10);
  return Number.isFinite(id) ? id : null;
};

export const getEvaluationHistoryStatus = (resume) =>
  typeof resume?.evaluationHistory?.evaluationStatus === "string"
    ? resume.evaluationHistory.evaluationStatus.toUpperCase()
    : null;

export const getEvaluationHistoryScore = (resume) => {
  const rawScore = resume?.evaluationHistory?.overallScore;
  if (rawScore == null || rawScore === "") {
    return null;
  }

  const score = Number(rawScore);
  return Number.isFinite(score) ? score : null;
};

export const getResumeMatchMode = (resume) => {
  const evaluationId = getEvaluationHistoryId(resume);
  const evaluationStatus = getEvaluationHistoryStatus(resume);

  if (evaluationId == null) {
    return "new";
  }

  if (evaluationStatus === "FAIL") {
    return "retry";
  }

  if (evaluationStatus === "WAITING" || evaluationStatus === "PARTIAL") {
    return "processing";
  }

  return "existing";
};
