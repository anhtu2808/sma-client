import { api, API_VERSION } from "@/apis/baseApi";

export const featureUsageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFeatureUsage: builder.query({
      query: () => ({
        url: `${API_VERSION}/feature-usage`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data ?? [],
      providesTags: ["FeatureUsage"],
    }),
    getFeatureUsageHistory: builder.query({
      query: (params) => ({
        url: `${API_VERSION}/feature-usage/history`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => {
        const paging = response?.data ?? {};
        return {
          content: Array.isArray(paging?.content) ? paging.content : [],
          pageNumber: Number(paging?.pageNumber ?? 0),
          pageSize: Number(paging?.pageSize ?? 10),
          totalElements: Number(paging?.totalElements ?? 0),
          totalPages: Number(paging?.totalPages ?? 0),
          first: Boolean(paging?.first ?? true),
          last: Boolean(paging?.last ?? true),
        };
      },
      providesTags: ["FeatureUsage"],
    }),
  }),
});

export const {
  useGetFeatureUsageQuery,
  useLazyGetFeatureUsageQuery,
  useGetFeatureUsageHistoryQuery,
  useLazyGetFeatureUsageHistoryQuery,
} = featureUsageApi;
