import { api, API_VERSION } from "./baseApi";

export const faqApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getPublicFaqs: builder.query({
            query: (params) => ({
                url: `${API_VERSION}/faqs`,
                method: "GET",
                params: {
                    ...params,
                    isPublished: true
                },
            }),
            providesTags: (result) =>
                result?.data?.content
                    ? [
                        ...result.data.content.map(({ id }) => ({ type: "Faqs", id })),
                        { type: "Faqs", id: "LIST" },
                    ]
                    : [{ type: "Faqs", id: "LIST" }],
        }),
    }),
});

export const {
    useGetPublicFaqsQuery,
} = faqApi;