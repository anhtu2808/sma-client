import { api, API_VERSION } from "@/apis/baseApi";

export const invitationApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getMyInvitations: builder.query({
            query: ({ page = 0, size = 100, status } = {}) => ({
                url: `${API_VERSION}/invitations/mine`,
                method: "GET",
                params: { page, size, status },
            }),
            transformResponse: (response) => response?.data,
            providesTags: ["Invitations"],
        }),

        getInvitationSummary: builder.query({
            query: () => ({
                url: `${API_VERSION}/invitations/mine/summary`,
                method: "GET",
            }),
            transformResponse: (response) => response?.data,
            providesTags: ["Invitations"],
        }),

        getInvitationById: builder.query({
            query: (id) => ({
                url: `${API_VERSION}/invitations/${id}`,
                method: "GET",
            }),
            transformResponse: (response) => response?.data,
            providesTags: (result, error, id) => [{ type: "Invitations", id }],
        }),

        updateInvitationStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `${API_VERSION}/invitations/${id}/status`,
                method: "PATCH",
                params: { status },
            }),
            invalidatesTags: ["Invitations"],
        }),

        takeActionOnInvitation: builder.mutation({
            query: ({ id, action }) => ({
                url: `${API_VERSION}/invitations/${id}`,
                method: "PUT",
                params: { action },
            }),
            invalidatesTags: ["Invitations"],
        }),

        getInvitationStatusCount: builder.query({
            query: () => ({
                url: `${API_VERSION}/invitations/mine/status-count`,
                method: "GET",
            }),
            transformResponse: (response) => response?.data,
            providesTags: ["Invitations"],
        }),
    }),
});

export const {
    useGetMyInvitationsQuery,
    useGetInvitationSummaryQuery,
    useGetInvitationByIdQuery,
    useUpdateInvitationStatusMutation,
    useTakeActionOnInvitationMutation,
    useGetInvitationStatusCountQuery,
} = invitationApi;
