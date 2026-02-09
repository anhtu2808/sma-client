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

        getCompanyById: builder.query({
            query: (id) => `${API_VERSION}/companies/${id}`,
            providesTags: (result, error, id) => [{ type: "Companies", id }]
        }),
    })
});

export const {
    useGetCompaniesQuery,
    useLazyGetCompaniesQuery,
    useGetCompanyByIdQuery,
} = companyApi;
