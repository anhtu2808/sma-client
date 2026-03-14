export type MatchStatus = "MATCHED" | "MISSING" | "FIXED";

export type MatchLevel = "EXCELLENT" | "GOOD" | "FAIR" | "POOR";

export type CandidateLevel = "SENIOR" | "MID" | "JUNIOR";

export type TransferabilityLevel = "HIGH" | "MEDIUM" | "LOW";

export interface SuggestionItem {
  id: number;
  suggestion: string;
}

export interface DetailItem {
  id: number;
  label: string;
  status: MatchStatus;
  description: string | null;
  requiredLevel: string | null;
  candidateLevel: CandidateLevel | "NONE" | null;
  isRequired: boolean | null;
  isFixed: boolean;
  context: string | null;
  impactScore: number | null;
  suggestions: SuggestionItem[];
}

export interface CriteriaScore {
  id: number;
  scoringCriteriaId: number | null;
  scoringCriteriaContext: string | null;
  criteriaName: string | null;
  scoringCriteriaWeight: number | null;
  criteriaType: string | null;
  aiScore: number;
  manualScore: number | null;
  weightedScore: number | null;
  aiExplanation: string;
  manualExplanation: string | null;
  details: DetailItem[];
}

export interface EvaluationData {
  id: number;
  aiOverallScore: number;
  recruiterOverallScore: number | null;
  matchLevel: MatchLevel;
  summary: string;
  strengths: string;
  weakness: string;
  resumeId: number;
  resumeFullName: string;
  candidateName: string;
  jobId: number;
  jobName: string;
  isTrueLevel: boolean;
  hasRelatedExperience: boolean;
  transferabilityToRole: TransferabilityLevel;
  criteriaScores: CriteriaScore[];
  evaluationStatus?: string | null;
  evaluationType?: string | null;
  isSpecificJd?: boolean | null;
  processingTimeSecond?: number | null;
  aiModelVersion?: string | null;
  weaknesses?: unknown[];
  gaps?: unknown[];
}

export interface MatchingReportUiState {
  activeCriteriaId: number | null;
  expandedItemIds: number[];
  activeDocumentTab: string;
}

export interface MatchingReportState {
  data: EvaluationData | null;
  ui: MatchingReportUiState;
}

const normalizeSuggestions = (suggestions?: SuggestionItem[] | null): SuggestionItem[] => {
  if (!Array.isArray(suggestions)) {
    return [];
  }

  return suggestions
    .filter((suggestion): suggestion is SuggestionItem => suggestion != null)
    .map((suggestion) => ({
      id: Number(suggestion.id),
      suggestion: typeof suggestion.suggestion === "string" ? suggestion.suggestion : "",
    }))
    .filter((suggestion) => Number.isFinite(suggestion.id));
};

const normalizeDetails = (details?: DetailItem[] | null): DetailItem[] => {
  if (!Array.isArray(details)) {
    return [];
  }

  return details.map((detail) => ({
    ...detail,
    suggestions: normalizeSuggestions(detail?.suggestions),
  }));
};

const normalizeCriteriaScores = (criteriaScores?: CriteriaScore[] | null): CriteriaScore[] => {
  if (!Array.isArray(criteriaScores)) {
    return [];
  }

  return criteriaScores.map((criteriaScore) => ({
    ...criteriaScore,
    details: normalizeDetails(criteriaScore?.details),
  }));
};

export const mapEvaluationToStore = (evaluationData: EvaluationData): MatchingReportState => {
  const normalizedEvaluationData = {
    ...evaluationData,
    criteriaScores: normalizeCriteriaScores(evaluationData?.criteriaScores),
  };

  return {
    data: normalizedEvaluationData,
    ui: {
      activeCriteriaId: normalizedEvaluationData.criteriaScores?.[0]?.id ?? null,
      expandedItemIds: [],
      activeDocumentTab: "resume",
    },
  };
};
