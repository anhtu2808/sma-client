import { api, API_VERSION } from "./baseApi";

export const notificationApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: (params) => ({
                url: `${API_VERSION}/notifications`,
                method: "GET",
                params,
            }),
            providesTags: ["Notifications"],
        }),

        markAsRead: builder.mutation({
            query: (id) => ({
                url: `${API_VERSION}/notifications/${id}/read`,
                method: "PATCH",
            }),
            invalidatesTags: ["Notifications"],
        }),

        markAllAsRead: builder.mutation({
            query: () => ({
                url: `${API_VERSION}/notifications/read-all`,
                method: "PATCH",
            }),
            invalidatesTags: ["Notifications"],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useMarkAsReadMutation,
    useMarkAllAsReadMutation,
} = notificationApi;