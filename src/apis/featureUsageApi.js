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
  }),
});

export const { useGetFeatureUsageQuery, useLazyGetFeatureUsageQuery } = featureUsageApi;
