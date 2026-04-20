export type MatchStatus = "MATCHED" | "MISSING" | "FIXED" | "PARTIAL";

export type MatchLevel = "EXCELLENT" | "GOOD" | "FAIR" | "POOR";

export type CandidateLevel = "SENIOR" | "MID" | "JUNIOR";

export type TransferabilityLevel = "HIGH" | "MEDIUM" | "LOW";

export interface SuggestionItem {
  id: number;
  suggestion: string;
}

export interface DetailItem {
  id: number;
  contextId?: number;
  tagIndex?: number | null;
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
  candidateLevel?: 'INTERN' | 'FRESHER' | 'JUNIOR' | 'MIDDLE' | 'SENIOR' | 'LEAD' | 'MANAGER' | null;
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

const normalizeMatchStatus = (status?: string | null): MatchStatus => {
  const normalized = typeof status === "string" ? status.trim().toUpperCase() : "";
  if (normalized === "MATCHED" || normalized === "MISSING" || normalized === "FIXED" || normalized === "PARTIAL") {
    return normalized as MatchStatus;
  }
  return "MISSING";
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

const countMissing = (cs: CriteriaScore) =>
  (cs.details ?? []).filter(
    (d) => (d.status === "MISSING" || d.status === "missing" || d.status === "PARTIAL" || d.status === "partial") && !d.isFixed
  ).length;

export const mapEvaluationToStore = (evaluationData: EvaluationData): MatchingReportState => {
  const normalizedEvaluationData = {
    ...evaluationData,
    criteriaScores: normalizeCriteriaScores(evaluationData?.criteriaScores).sort(
      (a, b) => countMissing(b) - countMissing(a) || a.id - b.id
    ),
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

// --- Contexts-based suggestion response transformer ---

interface ContextDetail {
  id: number;
  evaluationCriteriaScoreId: number;
  scoringCriteriaId: number;
  criteriaName: string;
  label: string;
  status?: MatchStatus | string;
  description: string;
  requiredLevel?: string | null;
  candidateLevel?: CandidateLevel | "NONE" | string | null;
  isRequired?: boolean | null;
  impactScore: number;
  isFixed?: boolean;
}

interface ContextItem {
  id: number;
  context: string;
  details: ContextDetail[];
  suggestions: SuggestionItem[];
}

interface SuggestionsResponse {
  evaluationId: number;
  jobId: number;
  jobName: string;
  resumeId: number;
  resumeFullName: string;
  aiOverallScore: number;
  criteriaScores: CriteriaScore[];
  contexts: ContextItem[];
}

export const mapSuggestionsToStore = (response: SuggestionsResponse): MatchingReportState => {
  if (!response) {
    return { data: null, ui: { activeCriteriaId: null, expandedItemIds: [], activeDocumentTab: "resume" } };
  }

  // Build a map of criteriaScore id → criteriaScore with empty details array
  const criteriaMap = new Map<number, CriteriaScore & { details: DetailItem[] }>();
  for (const cs of response.criteriaScores ?? []) {
    criteriaMap.set(cs.id, { ...cs, details: [] });
  }

  const seenDetailIds = new Set<number>();

  // Distribute context details into their parent criteria
  for (const [contextIndex, ctx] of (response.contexts ?? []).entries()) {
    const suggestions = normalizeSuggestions(ctx.suggestions);
    const tagIndex = ctx.details?.length ?? 0;

    for (const detail of ctx.details ?? []) {
      const criteria = criteriaMap.get(detail.evaluationCriteriaScoreId);
      if (!criteria) continue;

      seenDetailIds.add(detail.id);
      criteria.details.push({
        id: detail.id,
        contextId: ctx.id,
        tagIndex,
        label: detail.label,
        status: normalizeMatchStatus(detail.status),
        description: detail.description ?? null,
        requiredLevel: detail.requiredLevel ?? null,
        candidateLevel: detail.candidateLevel ?? null,
        isRequired: detail.isRequired ?? null,
        isFixed: detail.isFixed ?? false,
        context: ctx.context,
        impactScore: detail.impactScore ?? null,
        suggestions,
      });
    }
  }

  // Include MATCHED details from criteriaScores that have context
  for (const cs of response.criteriaScores ?? []) {
    const criteria = criteriaMap.get(cs.id);
    if (!criteria) continue;

    for (const detail of cs.details ?? []) {
      if (seenDetailIds.has(detail.id)) continue;
      if (!detail.context) continue;

      seenDetailIds.add(detail.id);
      criteria.details.push({
        id: detail.id,
        contextId: detail.contextId ?? undefined,
        tagIndex: null,
        label: detail.label,
        status: normalizeMatchStatus(detail.status),
        description: detail.description ?? null,
        requiredLevel: detail.requiredLevel ?? null,
        candidateLevel: detail.candidateLevel ?? null,
        isRequired: detail.isRequired ?? null,
        isFixed: detail.isFixed ?? false,
        context: detail.context,
        impactScore: detail.impactScore ?? null,
        suggestions: [],
      });
    }
  }

  const criteriaScores = Array.from(criteriaMap.values()).sort(
    (a, b) => countMissing(b) - countMissing(a) || a.id - b.id
  );

  return {
    data: {
      ...response,
      criteriaScores,
    } as unknown as EvaluationData,
    ui: {
      activeCriteriaId: criteriaScores[0]?.id ?? null,
      expandedItemIds: [],
      activeDocumentTab: "resume",
    },
  };
};
