import { configureStore } from "@reduxjs/toolkit";
import { DataApi } from "../features/dataApi";
import { authApi } from "../features/authApi"; // if using RTK Query
import authReducer from "../features/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [DataApi.reducerPath]: DataApi.reducer,
    [authApi.reducerPath]: authApi.reducer, // RTK Query reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(DataApi.middleware)
      .concat(authApi.middleware),

  devTools: process.env.NODE_ENV !== "production",
});
