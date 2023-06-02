import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:3000/api";

// Define a service using a base URL and expected endpoints
export const AppAPI = createApi({
  reducerPath: "api",
  tagTypes: ["Socket"],
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getSocketConnections: builder.query({
      query: () => "/get-socket-connections",
      providesTags: ["Socket"],
    }),
    resetSocketConnections: builder.mutation({
      query: (all = false) => ({
        url: "/reset-socket-connections",
        method: "POST",
        body: { all },
      }),
      invalidatesTags: ["Socket"],
    }),
    getNetworkInfo: builder.query({
      query: () => "/network-info",
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetSocketConnectionsQuery,
  useLazyGetSocketConnectionsQuery,
  useResetSocketConnectionsMutation,
  useLazyGetNetworkInfoQuery,
  useGetNetworkInfoQuery
} = AppAPI;
