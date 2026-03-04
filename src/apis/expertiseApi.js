import { api, API_VERSION } from "@/apis/baseApi";

export const expertiseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getExpertises: builder.query({
      query: ({ name, groupId, page = 0, size = 30 } = {}) => ({
        url: `${API_VERSION}/expertises`,
        method: "GET",
        params: {
          name,
          groupId,
          page,
          size,
        },
      }),
      transformResponse: (response) => response?.data?.content ?? [],
    }),
  }),
});

export const { useGetExpertisesQuery } = expertiseApi;
