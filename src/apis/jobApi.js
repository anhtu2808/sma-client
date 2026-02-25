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

        // Applied Jobs
        getMyApplications: builder.query({
            query: ({ page = 0, size = 10, status } = {}) => ({
                url: `${API_VERSION}/applications/my-applications`,
                method: "GET",
                params: { page, size, status }
            }),
            transformResponse: (response) => {
                return response?.data;
            },
            providesTags: ["Applications"]
        }),

        // Saved Jobs
        getMarkedJobs: builder.query({
            query: ({ page = 0, size = 10 } = {}) => ({
                url: `${API_VERSION}/jobs/marked`,
                method: "GET",
                params: { page, size }
            }),
            transformResponse: (response) => {
                return response?.data;
            },
            providesTags: ["Jobs"]
        }),

        // Applied Jobs (Candidate dashboard)
        getAppliedJobs: builder.query({
            query: ({ page = 0, size = 10 } = {}) => ({
                url: `${API_VERSION}/jobs/applied`,
                method: "GET",
                params: { page, size }
            }),
            transformResponse: (response) => {
                return response?.data;
            },
            providesTags: ["Jobs"]
        }),

        toggleMarkJob: builder.mutation({
            query: (jobId) => ({
                url: `${API_VERSION}/jobs/${jobId}/mark`,
                method: "POST",
            }),
            invalidatesTags: ["Jobs"],
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
    useGetMyApplicationsQuery,
    useLazyGetMyApplicationsQuery,
    useGetMarkedJobsQuery,
    useLazyGetMarkedJobsQuery,
    useGetAppliedJobsQuery,
    useLazyGetAppliedJobsQuery,
    useToggleMarkJobMutation,
} = jobApi;
