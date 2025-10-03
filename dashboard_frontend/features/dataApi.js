import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// This is a dynamic route
export const dynamic = "force-dynamic";

export const DataApi = createApi({
  reducerPath: "dataAPi",
  baseQuery: fetchBaseQuery({
    // baseUrl: `http://217.65.146.240:5000/api/`, // 👈 backend base URL browser to backend container in server
    baseUrl: `${API_URL}/api/`,
    prepareHeaders: (headers, { getState }) => {
      // Get token from Redux store (or any state)
      const token = getState().auth.accessToken;
      // If token exists, set Authorization header
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      // Always return headers
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // ✅ Stats endpoint (salesAgent optional)
    getLeadStats: builder.query({
      query: (params) => ({
        url: "LeadStats",
        params, // RTK Query handles encoding automatically
      }),
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "allUsers",
      }),
      providesTags: ["User"],
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
    // ✅ Top sales agent endpoint
    getTopSalesAgent: builder.query({
      query: () => ({
        url: "TopSalesAgent",
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
  useGetAllUsersQuery,
  useGetTopSalesAgentQuery,
} = DataApi;
