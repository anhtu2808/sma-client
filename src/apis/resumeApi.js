import { api, API_VERSION } from "@/apis/baseApi";
import { candidateApi } from "@/apis/candidateApi";
import { RESUME_TYPES } from "@/constant";

const upsertById = (items = [], item, options = {}) => {
    const { appendIfMissing = true } = options;
    if (!item?.id) return items;
    const found = items.some((current) => current?.id === item.id);
    if (!found) {
        return appendIfMissing ? [...items, item] : items;
    }
    return items.map((current) => (current?.id === item.id ? item : current));
};

const patchCandidateProfile = (dispatch, callback) => {
    dispatch(
        candidateApi.util.updateQueryData("candidateDashboardProfile", undefined, (draft) => {
            if (!draft) return;
            callback(draft);
        })
    );
};

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

        createResumeSkill: builder.mutation({
            query: ({ resumeId, payload }) => ({
                url: `${API_VERSION}/resumes/${resumeId}/skills`,
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response?.data ?? response,
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    patchCandidateProfile(dispatch, (draft) => {
                        draft.skills = upsertById(draft.skills, data);
                    });
                } catch (error) {
                }
            },
        }),

        updateResumeSkill: builder.mutation({
            query: ({ resumeId, resumeSkillId, payload }) => ({
                url: `${API_VERSION}/resumes/${resumeId}/skills/${resumeSkillId}`,
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response?.data ?? response,
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    patchCandidateProfile(dispatch, (draft) => {
                        draft.skills = upsertById(draft.skills, data);
                    });
                } catch (error) {
                }
            },
        }),

        createResumeEducation: builder.mutation({
            query: ({ resumeId, payload }) => ({
                url: `${API_VERSION}/resumes/${resumeId}/educations`,
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response?.data ?? response,
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    patchCandidateProfile(dispatch, (draft) => {
                        draft.educations = upsertById(draft.educations, data);
                    });
                } catch (error) {
                }
            },
        }),

        updateResumeEducation: builder.mutation({
            query: ({ resumeId, educationId, payload }) => ({
                url: `${API_VERSION}/resumes/${resumeId}/educations/${educationId}`,
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response?.data ?? response,
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    patchCandidateProfile(dispatch, (draft) => {
                        draft.educations = upsertById(draft.educations, data);
                    });
                } catch (error) {
                }
            },
        }),

        createResumeExperience: builder.mutation({
            query: ({ resumeId, payload }) => ({
                url: `${API_VERSION}/resumes/${resumeId}/experiences`,
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response?.data ?? response,
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    patchCandidateProfile(dispatch, (draft) => {
                        draft.experiences = upsertById(draft.experiences, data);
                    });
                } catch (error) {
                }
            },
        }),

        updateResumeExperience: builder.mutation({
            query: ({ resumeId, experienceId, payload }) => ({
                url: `${API_VERSION}/resumes/${resumeId}/experiences/${experienceId}`,
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response?.data ?? response,
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    patchCandidateProfile(dispatch, (draft) => {
                        draft.experiences = upsertById(draft.experiences, data);
                    });
                } catch (error) {
                }
            },
        }),

        createResumeExperienceDetail: builder.mutation({
            query: ({ resumeId, experienceId, payload }) => ({
                url: `${API_VERSION}/resumes/${resumeId}/experiences/${experienceId}/details`,
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response?.data ?? response,
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    patchCandidateProfile(dispatch, (draft) => {
                        const experiences = draft.experiences ?? [];
                        const target = experiences.find((experience) => experience?.id === arg?.experienceId);
                        if (!target) return;
                        target.details = upsertById(target.details, data);
                    });
                } catch (error) {
                }
            },
        }),

        updateResumeExperienceDetail: builder.mutation({
            query: ({ resumeId, experienceDetailId, payload }) => ({
                url: `${API_VERSION}/resumes/${resumeId}/experience-details/${experienceDetailId}`,
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response?.data ?? response,
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    patchCandidateProfile(dispatch, (draft) => {
                        const experiences = draft.experiences ?? [];
                        const target = experiences.find((experience) =>
                            (experience?.details ?? []).some((detail) => detail?.id === data?.id)
                        );
                        if (!target) return;
                        target.details = upsertById(target.details, data, { appendIfMissing: false });
                    });
                } catch (error) {
                }
            },
        }),

        createResumeProject: builder.mutation({
            query: ({ resumeId, payload }) => ({
                url: `${API_VERSION}/resumes/${resumeId}/projects`,
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response?.data ?? response,
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    patchCandidateProfile(dispatch, (draft) => {
                        draft.projects = upsertById(draft.projects, data);
                    });
                } catch (error) {
                }
            },
        }),

        updateResumeProject: builder.mutation({
            query: ({ resumeId, projectId, payload }) => ({
                url: `${API_VERSION}/resumes/${resumeId}/projects/${projectId}`,
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response?.data ?? response,
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    patchCandidateProfile(dispatch, (draft) => {
                        draft.projects = upsertById(draft.projects, data);
                    });
                } catch (error) {
                }
            },
        }),

        createResumeCertification: builder.mutation({
            query: ({ resumeId, payload }) => ({
                url: `${API_VERSION}/resumes/${resumeId}/certifications`,
                method: "POST",
                body: payload,
            }),
            transformResponse: (response) => response?.data ?? response,
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    patchCandidateProfile(dispatch, (draft) => {
                        draft.certifications = upsertById(draft.certifications, data);
                    });
                } catch (error) {
                }
            },
        }),

        updateResumeCertification: builder.mutation({
            query: ({ resumeId, certificationId, payload }) => ({
                url: `${API_VERSION}/resumes/${resumeId}/certifications/${certificationId}`,
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response?.data ?? response,
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    patchCandidateProfile(dispatch, (draft) => {
                        draft.certifications = upsertById(draft.certifications, data);
                    });
                } catch (error) {
                }
            },
        }),
    }),
});

export const {
    useGetCandidateResumesQuery,
    useUploadFilesMutation,
    useUploadCandidateResumeMutation,
    useDeleteCandidateResumeMutation,
    useCreateResumeSkillMutation,
    useUpdateResumeSkillMutation,
    useCreateResumeEducationMutation,
    useUpdateResumeEducationMutation,
    useCreateResumeExperienceMutation,
    useUpdateResumeExperienceMutation,
    useCreateResumeExperienceDetailMutation,
    useUpdateResumeExperienceDetailMutation,
    useCreateResumeProjectMutation,
    useUpdateResumeProjectMutation,
    useCreateResumeCertificationMutation,
    useUpdateResumeCertificationMutation,
} = resumeApi;
