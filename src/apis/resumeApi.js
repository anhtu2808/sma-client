import { api, API_VERSION } from "@/apis/baseApi";
import { candidateApi } from "@/apis/candidateApi";
import { RESUME_TYPES } from "@/constant";

const normalizeGroupName = (value) => `${value ?? ""}`.trim().replace(/\s+/g, " ");
const normalizeLookupKey = (value) => normalizeGroupName(value).toLowerCase();

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

const ensureSkillGroups = (draft) => {
    if (!Array.isArray(draft.skillGroups)) {
        draft.skillGroups = [];
    }
    return draft.skillGroups;
};

const removeResumeSkillFromProfileCache = (draft, resumeSkillId) => {
    const groups = ensureSkillGroups(draft);
    for (const group of groups) {
        if (!Array.isArray(group?.skills)) continue;
        group.skills = group.skills.filter((skill) => skill?.id !== resumeSkillId);
    }
    draft.skillGroups = groups.filter((group) => (group?.skills ?? []).length > 0);
};

const upsertResumeSkillIntoProfileCache = (draft, resumeSkill) => {
    if (!resumeSkill?.id) return;

    const groups = ensureSkillGroups(draft);

    // Remove the skill from any previous group (supports "move group" on update).
    for (const group of groups) {
        if (!Array.isArray(group?.skills)) continue;
        group.skills = group.skills.filter((skill) => skill?.id !== resumeSkill.id);
    }

    const targetGroupId = resumeSkill?.skillGroupId ?? null;
    const targetGroupName = normalizeGroupName(resumeSkill?.skillGroupName);
    const targetGroupKey = normalizeLookupKey(targetGroupName);

    let targetGroup =
        (targetGroupId ? groups.find((group) => group?.id === targetGroupId) : null) ||
        (targetGroupKey ? groups.find((group) => normalizeLookupKey(group?.name) === targetGroupKey) : null);

    if (!targetGroup) {
        const maxOrderIndex = Math.max(
            0,
            ...groups.map((group) => (Number.isFinite(Number(group?.orderIndex)) ? Number(group.orderIndex) : 0))
        );
        targetGroup = {
            id: targetGroupId,
            name: targetGroupName || "Ungrouped",
            orderIndex: maxOrderIndex + 1,
            skills: [],
        };
        groups.push(targetGroup);
    }

    if (!Array.isArray(targetGroup.skills)) {
        targetGroup.skills = [];
    }
    if (targetGroupId && !targetGroup.id) {
        targetGroup.id = targetGroupId;
    }
    if (targetGroupName) {
        targetGroup.name = targetGroupName;
    }

    const index = targetGroup.skills.findIndex((skill) => skill?.id === resumeSkill.id);
    if (index >= 0) {
        targetGroup.skills[index] = resumeSkill;
    } else {
        targetGroup.skills.push(resumeSkill);
    }

    draft.skillGroups = groups.filter((group) => (group?.skills ?? []).length > 0);
};

export const resumeApi = api.injectEndpoints({
    // Helps CRA Fast Refresh/HMR apply endpoint changes (e.g. remove invalidatesTags)
    // without requiring a full dev-server restart.
    overrideExisting: process.env.NODE_ENV === "development",
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

        getResumeParseStatus: builder.query({
            query: ({ resumeId }) => ({
                url: `${API_VERSION}/resumes/${resumeId}/parse-status`,
                method: "GET",
            }),
            transformResponse: (response) => response?.data ?? "WAITING",
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

        parseCandidateResume: builder.mutation({
            query: ({ resumeId }) => ({
                url: `${API_VERSION}/resumes/${resumeId}/parse`,
                method: "POST",
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

        setResumeAsProfile: builder.mutation({
            query: ({ resumeId }) => ({
                url: `${API_VERSION}/resumes/${resumeId}/set-profile`,
                method: "POST",
            }),
            transformResponse: (response) => response?.data ?? response,
            invalidatesTags: [
                "Users",
                { type: "Resumes", id: RESUME_TYPES.PROFILE },
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
                        upsertResumeSkillIntoProfileCache(draft, data);
                    });
                } catch (error) {
                }
            },
            invalidatesTags: [],
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
                        upsertResumeSkillIntoProfileCache(draft, data);
                    });
                } catch (error) {
                }
            },
            invalidatesTags: [],
        }),

        deleteResumeSkill: builder.mutation({
            query: ({ resumeId, resumeSkillId }) => ({
                url: `${API_VERSION}/resumes/${resumeId}/skills/${resumeSkillId}`,
                method: "DELETE",
            }),
            transformResponse: (response) => response?.data ?? response,
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    candidateApi.util.updateQueryData("candidateDashboardProfile", undefined, (draft) => {
                        if (!draft) return;
                        removeResumeSkillFromProfileCache(draft, arg?.resumeSkillId);
                    })
                );

                try {
                    await queryFulfilled;
                } catch (error) {
                    patchResult.undo();
                }
            },
            invalidatesTags: [],
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
    useLazyGetResumeParseStatusQuery,
    useUploadFilesMutation,
    useUploadCandidateResumeMutation,
    useParseCandidateResumeMutation,
    useDeleteCandidateResumeMutation,
    useSetResumeAsProfileMutation,
    useCreateResumeSkillMutation,
    useUpdateResumeSkillMutation,
    useDeleteResumeSkillMutation,
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
