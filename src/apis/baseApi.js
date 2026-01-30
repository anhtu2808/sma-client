import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import omitBy from "lodash/omitBy";
import isNil from "lodash/isNil";

export const API_VERSION = "/v1";

const stripNullish = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    return omitBy(obj, isNil);
};

const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
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
    if (typeof args === "object") {
        const { params, body, ...rest } = args;
        return rawBaseQuery(
            {
                ...rest,
                params: stripNullish(params),
                body
            },
            api,
            extra
        );
    }
    return rawBaseQuery(args, api, extra);
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: customBaseQuery,
    tagTypes: ["Users", "Jobs", "Applications", "Companies"],
    endpoints: () => ({})
});
