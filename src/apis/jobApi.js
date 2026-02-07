import { api, API_VERSION } from "@/apis/baseApi";

export const jobApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getJobs: builder.query({
            query: (params) => ({
                url: `${API_VERSION}/jobs`,
                method: "GET",
                params: params,
            }),
            providesTags: ["Jobs"]
        }),

        getJobById: builder.query({
            query: (id) => `${API_VERSION}/jobs/${id}`,
            providesTags: ["Jobs"]
        }),
    })
});

export const {
    useGetJobsQuery,
    useLazyGetJobsQuery,
    useGetJobByIdQuery,
    useLazyGetJobByIdQuery,
} = jobApi;