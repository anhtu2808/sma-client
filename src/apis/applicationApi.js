import { api, API_VERSION } from "@/apis/baseApi";

export const applicationApi = api.injectEndpoints({
    overrideExisting: process.env.NODE_ENV === "development",
    endpoints: (builder) => ({
        applyJob: builder.mutation({
            query: (payload) => ({
                url: `${API_VERSION}/applications`,
                method: "POST",
                body: payload,
            }),
            invalidatesTags: (result, error, payload) => [
                { type: "Jobs", id: parseInt(payload.jobId) },
                "Jobs"
            ],
        }),

    }),
});

export const {
    useApplyJobMutation,
} = applicationApi;