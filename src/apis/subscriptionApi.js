import { api, API_VERSION } from "@/apis/baseApi";

export const subscriptionApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createSubscription: builder.mutation({
            query: (body) => ({
                url: `${API_VERSION}/subscriptions`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Plans"], // Assuming subscribing might affect current plan status
        }),
    }),
});

export const { useCreateSubscriptionMutation } = subscriptionApi;
