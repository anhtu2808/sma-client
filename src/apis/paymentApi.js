import { api, API_VERSION } from "@/apis/baseApi";

export const paymentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getPaymentStatus: builder.query({
            query: (id) => `${API_VERSION}/payments/${id}/status`,
        }),
    }),
});

export const { useGetPaymentStatusQuery } = paymentApi;
