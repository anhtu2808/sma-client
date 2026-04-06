import { api, API_VERSION } from "./baseApi";

export const publicPolicyApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getPublicPolicy: builder.query({
            query: (type) => ({
                url: `${API_VERSION}/policies/${type}`,
                method: "GET",
            }),
        }),
    }),
});

export const { useGetPublicPolicyQuery } = publicPolicyApi;