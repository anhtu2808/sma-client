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
        getNotificationSettings: builder.query({
            query: () => ({
                url: `/v1/notification-settings`,
                method: "GET",
            }),
            providesTags: ['NotificationSettings'],
        }),
        updateNotificationSetting: builder.mutation({
            query: (body) => ({
                url: `/v1/notification-settings`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ['NotificationSettings'],
        }),
        resetSettings: builder.mutation({
            query: () => ({
                url: `/v1/notification-settings/reset`,
                method: "POST",
            }),
            invalidatesTags: ['NotificationSettings'],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useMarkAsReadMutation,
    useMarkAllAsReadMutation,
    useGetNotificationSettingsQuery,
    useUpdateNotificationSettingMutation,
    useResetSettingsMutation
} = notificationApi;