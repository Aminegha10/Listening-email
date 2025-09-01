import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const DataApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/", // 👈 using your backend API now
  }),
  endpoints: (builder) => ({
    // ✅ Stats endpoint (salesAgent optional)
    getLeadStats: builder.query({
      query: (params) => ({
        url: "LeadStats",
        params, // RTK Query will handle encoding automatically
      }),
    }),
    // ✅ Orders table endpoint
    getOrdersTable: builder.query({
      query: (params) => ({
        url: "OrdersTableStats",
        params,
      }),
    }),
    // ✅ Orders/Leads radar chart endpoint
  }),
});

export const { useGetLeadStatsQuery, useGetOrdersTableQuery } = DataApi;
