import { api, API_VERSION } from "@/apis/baseApi";

export const paymentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getPaymentStatus: builder.query({
            query: (id) => `${API_VERSION}/payments/${id}/status`,
        }),
        getPaymentHistory: builder.query({
            query: (params) => ({
                url: `${API_VERSION}/payments/history`,
                method: "GET",
                params,
            }),
            transformResponse: (response) => {
                const paging = response?.data ?? {};
                return {
                    content: Array.isArray(paging?.content) ? paging.content : [],
                    pageNumber: Number(paging?.pageNumber ?? 0),
                    pageSize: Number(paging?.pageSize ?? 10),
                    totalElements: Number(paging?.totalElements ?? 0),
                    totalPages: Number(paging?.totalPages ?? 0),
                    first: Boolean(paging?.first ?? true),
                    last: Boolean(paging?.last ?? true),
                };
            },
        }),
    }),
});

export const { useGetPaymentStatusQuery, useGetPaymentHistoryQuery } = paymentApi;
