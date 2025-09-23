import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "./authSlice";

// const API_URL = process.env.local.NEXT_PUBLIC_API_URL;

// This isyttttt(tyhtttttyyy) a dynamic route
// export const dynamic = "force-dynamic";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://217.65.146.240:5000/api/`, // 👈 backend base URL browser to backend container in server
    // baseUrl: `http://localhost:5000/api/auth/`,
    credentials: "include", // ✅ SEND COOKIES
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

  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: "register",
        method: "POST", // ✅ Usually login is POST
        body: credentials, // ✅ Send data in request body
      }),
      // async onQueryStarted(args, { dispatch, queryFulfilled }) {
      //   try {
      //     // console.log("d");
      //     const { data } = await queryFulfilled;
      //     dispatch(
      //       setCredentials({ accessToken: data.accessToken, user: data.user })
      //     );
      //   } catch (err) {
      //     console.log("err");
      //   }
      // },
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "login",
        method: "POST", // ✅ Usually login is POST
        body: credentials, // ✅ Send data in request body
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          // console.log("d");
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({ accessToken: data.accessToken, user: data.user })
          );
        } catch (err) {
          console.log(err);
        }
      },
    }),
    updatePassword: builder.mutation({
      query: (newPassword) => ({
        url: "updatePassword",
        method: "PUT", // ✅ Usually login is POST
        body: { newPassword }, // ✅ Send data in request body
      }),
      // async onQueryStarted(args, { dispatch, queryFulfilled }) {
      //   try {
      //     // console.log("d");
      //     const { data } = await queryFulfilled;
      //     dispatch(
      //       setCredentials({ accessToken: data.accessToken, user: data.user })
      //     );
      //   } catch (err) {
      //     console.log("err");
      //   }
      // },
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "refresh",
        method: "POST",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({ accessToken: data.accessToken, user: data.user })
          );
        } catch (err) {
          // dispatch(logout()); // refresh failed
          console.log("youve been logged out");
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
    }),
  }),
});
export const {
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
  useUpdatePasswordMutation,
  useRegisterMutation,
} = authApi;
