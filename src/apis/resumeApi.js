import { api, API_VERSION } from "@/apis/baseApi";
import { RESUME_TYPES } from "@/constant";

export const resumeApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCandidateResumes: builder.query({
            query: ({ keyword, type } = {}) => ({
                url: `${API_VERSION}/resumes`,
                method: "GET",
                params: { keyword, type },
            }),
            transformResponse: (response) => response?.data ?? [],
            providesTags: (result, error, arg) => [
                { type: "Resumes", id: arg?.type || "ALL" },
            ],
        }),

        uploadFiles: builder.mutation({
            query: (formData) => ({
                url: "/files/upload",
                method: "POST",
                body: formData,
            }),
        }),

        uploadCandidateResume: builder.mutation({
            query: (payload) => ({
                url: `${API_VERSION}/resumes/upload`,
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response?.data ?? response,
            invalidatesTags: [
                { type: "Resumes", id: RESUME_TYPES.ORIGINAL },
                { type: "Resumes", id: RESUME_TYPES.TEMPLATE },
                { type: "Resumes", id: "ALL" },
            ],
        }),

        deleteCandidateResume: builder.mutation({
            query: ({ resumeId }) => ({
                url: `${API_VERSION}/resumes/${resumeId}`,
                method: "DELETE",
            }),
            invalidatesTags: [
                { type: "Resumes", id: RESUME_TYPES.ORIGINAL },
                { type: "Resumes", id: RESUME_TYPES.TEMPLATE },
                { type: "Resumes", id: "ALL" },
            ],
        }),
    }),
});

export const {
    useGetCandidateResumesQuery,
    useUploadFilesMutation,
    useUploadCandidateResumeMutation,
    useDeleteCandidateResumeMutation,
} = resumeApi;
