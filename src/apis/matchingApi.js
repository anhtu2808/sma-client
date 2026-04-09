import { api, API_VERSION } from "@/apis/baseApi";

const normalizeEvaluationStatus = (status) =>
  typeof status === "string" ? status.toUpperCase() : "WAITING";

export const matchingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllMatching: builder.query({
      query: ({ page = 0, size = 10 }) => ({
        url: `${API_VERSION}/matching`,
        params: { page, size },
      }),
      transformResponse: (response) => response?.data ?? null,
    }),

    startMatchingDetail: builder.mutation({
      query: ({ jobId, resumeId }) => ({
        url: `${API_VERSION}/matching/detail`,
        method: "POST",
        params: { jobId, resumeId },
      }),
      transformResponse: (response) => response?.data ?? null,
      invalidatesTags: ["FeatureUsage"],
    }),

    getMatchingDetail: builder.query({
      query: ({ evaluationId }) => ({
        url: `${API_VERSION}/matching/${evaluationId}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data ?? null,
    }),

    getMatchingStatus: builder.query({
      query: ({ evaluationId }) => ({
        url: `${API_VERSION}/matching/${evaluationId}/status`,
        method: "GET",
      }),
      transformResponse: (response) => normalizeEvaluationStatus(response?.data),
    }),

    regenerateSuggestion: builder.mutation({
      query: ({ suggestionId }) => ({
        url: `${API_VERSION}/matching/suggestion/${suggestionId}`,
        method: "PUT",
      }),
      transformResponse: (response) => response?.data ?? null,
    }),

    markDetailAsFixed: builder.mutation({
      query: ({ detailId }) => ({
        url: `${API_VERSION}/criteria-score/detail/${detailId}/mark-as-fixed`,
        method: "PUT",
      }),
      transformResponse: (response) => response?.data ?? null,
    }),

    markDetailAsFixedBatch: builder.mutation({
      query: ({ detailIds }) => ({
        url: `${API_VERSION}/criteria-score/details/mark-as-fixed-batch`,
        method: "PUT",
        body: { detailIds },
      }),
      transformResponse: (response) => response?.data ?? null,
    }),

    unmarkDetailAsFixed: builder.mutation({
      query: ({ detailId }) => ({
        url: `${API_VERSION}/criteria-score/detail/${detailId}/unmark-as-fixed`,
        method: "PUT",
      }),
      transformResponse: (response) => response?.data ?? null,
    }),

    getMatchingSuggestions: builder.query({
      query: ({ evaluationId }) => ({
        url: `${API_VERSION}/matching/${evaluationId}/suggestions`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data ?? null,
    }),
  }),
});

export const {
  useGetAllMatchingQuery,
  useLazyGetAllMatchingQuery,
  useStartMatchingDetailMutation,
  useGetMatchingStatusQuery,
  useLazyGetMatchingStatusQuery,
  useGetMatchingDetailQuery,
  useLazyGetMatchingDetailQuery,
  useRegenerateSuggestionMutation,
  useMarkDetailAsFixedMutation,
  useMarkDetailAsFixedBatchMutation,
  useUnmarkDetailAsFixedMutation,
  useLazyGetMatchingSuggestionsQuery,
} = matchingApi;
