import { createAction, createAsyncThunk, nanoid } from "@reduxjs/toolkit";
import axios from "axios";

const POST_URL = "https://jsonplaceholder.typicode.com/posts?_limit=21";

export const addPost = createAction(
  "post/addPost",
  function prepare(title, body) {
    return {
      payload: {
        id: nanoid(),
        title,
        body,
      },
    };
  },
);

//-------

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_args, _thunkAPI) => {
    try {
      const res = await axios.get(POST_URL);
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
  },
);

//-------

interface PostData {
  title: string;
  body: string;
  userId: number;
}

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (data: PostData, _thunkAPI) => {
    console.log("data = ** ", data);
    try {
      const res = await axios.post(POST_URL, data);
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
  },
);
