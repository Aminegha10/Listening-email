import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ✅ Get backend URL from environment variables
const API_URL = "http://217.65.146.240:5000";

export const DataApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api/`, // 👈 backend base URL
  }),
  endpoints: (builder) => ({
    // ✅ Stats endpoint (salesAgent optional)
    getLeadStats: builder.query({
      query: (params) => ({
        url: "LeadStats",
        params, // RTK Query handles encoding automatically
      }),
    }),

    // ✅ Orders table endpoint
    getOrdersTable: builder.query({
      query: (params) => ({
        url: "OrdersTableStats",
        params,
      }),
    }),
  }),
});

export const { useGetLeadStatsQuery, useGetOrdersTableQuery } = DataApi;
