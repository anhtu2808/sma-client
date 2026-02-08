import { api, API_VERSION } from "@/apis/baseApi";

export const companyApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCompanies: builder.query({
            query: (params) => ({
                url: `${API_VERSION}/companies`,
                method: "GET",
                params: params,
            }),
            providesTags: ["Companies"]
        }),
    })
});

export const {
    useGetCompaniesQuery,
    useLazyGetCompaniesQuery,
} = companyApi;
