import { api, API_VERSION } from "@/apis/baseApi";

const normalizeEvaluationStatus = (status) =>
  typeof status === "string" ? status.toUpperCase() : "WAITING";

export const matchingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    startMatchingDetail: builder.mutation({
      query: ({ jobId, resumeId }) => ({
        url: `${API_VERSION}/matching/detail`,
        method: "POST",
        params: { jobId, resumeId },
      }),
      transformResponse: (response) => response?.data ?? null,
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
  }),
});

export const {
  useStartMatchingDetailMutation,
  useGetMatchingStatusQuery,
  useLazyGetMatchingStatusQuery,
  useGetMatchingDetailQuery,
  useLazyGetMatchingDetailQuery,
  useRegenerateSuggestionMutation,
  useMarkDetailAsFixedMutation,
} = matchingApi;
