import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const API_URL = process.env.local.NEXT_PUBLIC_API_URL;

// This is a dynamic route
export const dynamic = "force-dynamic";

export const DataApi = createApi({
  reducerPath: "dataAPi",
  baseQuery: fetchBaseQuery({
    // baseUrl: `http://217.65.146.240:5000/api/`, // 👈 backend base URL browser to backend container in server
    baseUrl: `http://localhost:5000/api/`,
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
      query: (params) => ({
        url: "TopProducts",
        params,
      }),
    }),
    // ✅ Products details endpoint
    getProductsDetails: builder.query({
      query: (params) => ({
        url: "ProductsDetails",
        params,
      }),
    }),
    // top clients
    getClients: builder.query({
      query: (params) => ({
        url: "getClients",
        params,
      }),
    }),
  }),
});

export const {
  useGetLeadStatsQuery,
  useGetOrdersTableQuery,
  useGetOrdersByAgentsQuery,
  useGetTopProductsQuery,
  useGetProductsDetailsQuery,
  useGetClientsQuery,
} = DataApi;
