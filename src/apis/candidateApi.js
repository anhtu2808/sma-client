import { api, API_VERSION } from "@/apis/baseApi";

export const candidateApi = api.injectEndpoints({
    endpoints: (builder) => ({
        candidateProfile: builder.query({
            query: () => ({
                url: `${API_VERSION}/candidate/me`,
                method: "GET",
            }),
            providesTags: ["Users"],
        }),
        candidateDashboardProfile: builder.query({
            query: () => ({
                url: `${API_VERSION}/candidate/profile`,
                method: "GET",
            }),
            transformResponse: (response) => response?.data ?? null,
            providesTags: ["Users"],
        }),

        updateCandidateDashboardProfile: builder.mutation({
            query: (payload) => ({
                url: `${API_VERSION}/candidate/profile`,
                method: "PUT",
                body: payload,
            }),
            transformResponse: (response) => response?.data ?? response,
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                // Optimistic patch (only top-level candidate fields, not resume-derived fields).
                const patchResult = dispatch(
                    api.util.updateQueryData("candidateDashboardProfile", undefined, (draft) => {
                        if (!draft || !arg) return;
                        const fields = [
                            "fullName",
                            "avatar",
                            "jobTitle",
                            "linkedinUrl",
                            "githubUrl",
                            "websiteUrl",
                            "address",
                            "expectedSalaryMin",
                            "expectedSalaryMax",
                            "availabilityDate",
                            "isProfilePublic",
                            "showAs",
                        ];
                        for (const key of fields) {
                            if (Object.prototype.hasOwnProperty.call(arg, key)) {
                                draft[key] = arg[key];
                            }
                        }
                    })
                );

                try {
                    const { data } = await queryFulfilled;
                    // Server returns the merged profile (includes resume-derived fields) — replace cache.
                    dispatch(
                        api.util.updateQueryData("candidateDashboardProfile", undefined, (draft) => {
                            if (!draft) return;
                            Object.assign(draft, data);
                        })
                    );
                } catch (error) {
                    patchResult.undo();
                }
            },
            invalidatesTags: [],
        }),
    }),
});

export const {
    useCandidateProfileQuery,
    useCandidateDashboardProfileQuery,
    useUpdateCandidateDashboardProfileMutation,
} = candidateApi;
