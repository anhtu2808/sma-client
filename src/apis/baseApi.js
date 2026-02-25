import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import omitBy from "lodash/omitBy";
import isNil from "lodash/isNil";

export const API_VERSION = "/v1";
// export const BASE_URL = process.env.REACT_APP_API_URL || "https://api.smartrecruit.tech";
export const BASE_URL = "https://api.smartrecruit.tech";

const stripNullish = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    return omitBy(obj, isNil);
};

const rawBaseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
    responseHandler: async (response) => {
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch (e) {
            return text;
        }
    },
});

const customBaseQuery = (args, api, extra) => {
    const normalizedArgs =
        typeof args === "object"
            ? {
                ...args,
                params: stripNullish(args.params),
            }
            : args;

    const result = rawBaseQuery(normalizedArgs, api, extra);

    if (result && typeof result.then === "function") {
        return result.then((response) => {
            if (response?.error?.status === 401) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            }
            return response;
        });
    }

    if (result?.error?.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }

    return result;
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: customBaseQuery,
    tagTypes: ["Users", "Jobs", "Applications", "Companies", "Resumes", "Plans", "FeatureUsage"],
    endpoints: () => ({})
});
