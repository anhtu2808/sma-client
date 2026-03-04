import { api, API_VERSION } from "@/apis/baseApi";

export const domainApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDomains: builder.query({
      query: ({ query, page = 0, size = 30 } = {}) => ({
        url: `${API_VERSION}/domains`,
        method: "GET",
        params: {
          query,
          page,
          size,
        },
      }),
      transformResponse: (response) => response?.data?.content ?? [],
    }),
  }),
});

export const { useGetDomainsQuery } = domainApi;
