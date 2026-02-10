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
            providesTags: (result, error, id) => [{ type: "Jobs", id: parseInt(id) }],
        }),

        getJobQuestions: builder.query({
            query: ({ jobId, params }) => ({
                url: `${API_VERSION}/jobs/${jobId}/job-questions`,
                method: "GET",
                params: params,
            }),
            transformResponse: (response) => {
                const rawData = response?.data;
                if (Array.isArray(rawData)) return rawData;
                return rawData?.content || [];
            },
            providesTags: (result, error, { jobId }) => [{ type: "JobQuestions", id: jobId }]
        }),
    })
});

export const {
    useGetJobsQuery,
    useLazyGetJobsQuery,
    useGetJobByIdQuery,
    useLazyGetJobByIdQuery,
    useGetJobQuestionsQuery,
    useLazyGetJobQuestionsQuery,
} = jobApi;