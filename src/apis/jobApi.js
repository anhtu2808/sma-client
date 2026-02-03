import { api, API_VERSION } from "@/apis/baseApi";

export const jobApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Định nghĩa API lấy danh sách công việc dựa trên hình ảnh Swagger
        getJobs: builder.query({
            query: (params) => ({
                url: `${API_VERSION}/jobs`, // Endpoint /v1/jobs từ hình ảnh
                method: "GET",
                params: params, // Truyền các tham số: name, salaryStart, jobLevel, page, size...
            }),
            providesTags: ["Jobs"]
        }),
    })
});

export const {
    useGetJobsQuery,
    useLazyGetJobsQuery,
} = jobApi;