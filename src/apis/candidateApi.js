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
    }),
});

export const { useCandidateProfileQuery } = candidateApi;
