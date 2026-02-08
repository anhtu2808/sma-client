import { api, API_VERSION } from "@/apis/baseApi";

export const skillApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSkills: builder.query({
      query: ({ name, categoryId, page = 0, size = 30 } = {}) => ({
        url: `${API_VERSION}/skills`,
        method: "GET",
        params: {
          name,
          categoryId,
          page,
          size,
        },
      }),
      transformResponse: (response) => response?.data?.content ?? [],
    }),
  }),
});

export const { useGetSkillsQuery } = skillApi;
