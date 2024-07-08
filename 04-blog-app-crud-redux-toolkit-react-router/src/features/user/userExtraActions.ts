import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const USER_URL = "https://jsonplaceholder.typicode.com/users?_limit=20";

//-------

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  try {
    const res = await axios.get(USER_URL);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return Promise.reject(new Error(error.response.data.message));
    } else if (error instanceof Error) {
      return Promise.reject(new Error(error.message));
    } else {
      return Promise.reject(new Error("An unknown error occurred"));
    }
  }
});
