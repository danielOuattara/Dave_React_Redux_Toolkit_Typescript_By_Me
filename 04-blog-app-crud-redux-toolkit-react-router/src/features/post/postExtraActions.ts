import { createAction, createAsyncThunk, nanoid } from "@reduxjs/toolkit";
import axios from "axios";

const POST_URL = "https://jsonplaceholder.typicode.com/posts";

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

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (data: ICreatePost, _thunkAPI) => {
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

//----------

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (data: IUpdatePost, _thunkAPI) => {
    try {
      const { id } = data;
      const res = await axios.put(`${POST_URL}/${id}`, data);
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

//----------

// export const deletePost = createAsyncThunk(
//   "posts/deletePost",
//   async (data: Post, _thunkAPI) => {
//     console.log("data = ", data);
//     try {
//       const { id } = data;
//       const res = await axios.delete(`${POST_URL}/${id}`);
//       if (res.status === 200) {
//         return { id };
//       } else {
//         return `${res.status}: ${res.statusText}`;
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error) && error.response) {
//         return Promise.reject(new Error(error.response.data.message));
//       } else if (error instanceof Error) {
//         return Promise.reject(new Error(error.message));
//       } else {
//         return Promise.reject(new Error("An unknown error occurred"));
//       }
//     }
//   },
// );

export const deletePost = createAsyncThunk<IDeletePost, number>(
  "posts/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${POST_URL}/${postId}`);
      if (res.status === 200) {
        return { id: postId };
      } else {
        return rejectWithValue(`${res.status}: ${res.statusText}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      } else if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  },
);
