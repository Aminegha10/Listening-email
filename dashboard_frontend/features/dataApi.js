import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
    // ✅ Orders by agents endpoint
    getOrdersByAgents: builder.query({
      query: () => ({
        url: "OrdersByAgents",
      }),
    }),
    // ✅ Top products endpoint
    getTopProducts: builder.query({
      query: () => ({
        url: "TopProducts",
      }),
    }),
  }),
});

export const {
  useGetLeadStatsQuery,
  useGetOrdersTableQuery,
  useGetOrdersByAgentsQuery,
  useGetTopProductsQuery,
} = DataApi;
