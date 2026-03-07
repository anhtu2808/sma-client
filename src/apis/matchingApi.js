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

    getMatchingStatus: builder.query({
      query: ({ evaluationId }) => ({
        url: `${API_VERSION}/matching/${evaluationId}/status`,
        method: "GET",
      }),
      transformResponse: (response) => normalizeEvaluationStatus(response?.data),
    }),
    getMatchingDetail: builder.query({
      query: ({ evaluationId }) => ({
        url: `${API_VERSION}/matching/${evaluationId}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data ?? {},
    }),
  }),
});

export const {
  useStartMatchingDetailMutation,
  useGetMatchingStatusQuery,
  useLazyGetMatchingStatusQuery,
  useGetMatchingDetailQuery,
} = matchingApi;
