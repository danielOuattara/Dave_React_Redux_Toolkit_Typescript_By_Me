import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const URL = "http://localhost:3510";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: URL }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({}),
});
