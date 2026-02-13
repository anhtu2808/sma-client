import { api, API_VERSION } from "@/apis/baseApi";

export const planApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query({
      query: (params) => ({
        url: `${API_VERSION}/plans`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => response?.data?.content ?? [],
      providesTags: ["Plans"],
    }),
  }),
});

export const { useGetPlansQuery, useLazyGetPlansQuery } = planApi;
