import { api, API_VERSION } from "@/apis/baseApi";

export const userApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: ({ page, size, search }) => ({
                url: `${API_VERSION}/users`,
                params: { page, size, search }
            }),
            providesTags: ["Users"]
        }),
        getUserById: builder.query({
            query: ({ userId }) => ({
                url: `${API_VERSION}/users/${userId}`
            }),
            providesTags: ["Users"]
        }),
        createUser: builder.mutation({
            query: (data) => ({
                url: `${API_VERSION}/users`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Users"]
        }),
        updateUser: builder.mutation({
            query: ({ userId, ...data }) => ({
                url: `${API_VERSION}/users/${userId}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["Users"]
        }),
        deleteUser: builder.mutation({
            query: ({ userId }) => ({
                url: `${API_VERSION}/users/${userId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Users"]
        }),
    })
});

export const {
    useGetUsersQuery,
    useLazyGetUsersQuery,
    useGetUserByIdQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = userApi;
