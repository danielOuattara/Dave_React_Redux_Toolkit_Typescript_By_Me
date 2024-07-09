// https://reselect.js.org/api/createselector/

import { createSlice, nanoid, createEntityAdapter } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import {
  addNewPost,
  deletePost,
  fetchPosts,
  updatePost,
} from "./postExtraActions";
import { RootState } from "../../store";

export const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const postInitialState = postsAdapter.getInitialState({
  status: "idle",
  error: null as string | null,
  counter: 0,
});

//-------

const postSlice = createSlice({
  name: "post",
  initialState: postInitialState,
  reducers: {
    addPost: {
      reducer(state, action: PayloadAction<Post>) {
        postsAdapter.addOne(state, action.payload);
      },
      prepare({
        title,
        body,
        userId,
      }: Omit<Post, "id" | "reactions" | "date">) {
        return {
          payload: {
            id: nanoid(),
            title,
            body,
            userId,
            date: new Date().toISOString(),
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            },
          },
        };
      },
    },

    addReaction(
      state,
      action: PayloadAction<{ postId: string; reaction: ReactionType }>,
    ) {
      const { postId, reaction } = action.payload;
      const existingPost = state.entities[postId];
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },

    increaseCounter(state) {
      state.counter += 1;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.status = "succeeded";

        // adding date & reactions
        let min = 1;
        const loadedPosts = action.payload.map((post) => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          };
          return post;
        });

        // Add any fetched posts to the array
        postsAdapter.upsertMany(state, loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch posts";
      })
      .addCase(addNewPost.fulfilled, (state, action: PayloadAction<Post>) => {
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0,
        };
        postsAdapter.addOne(state, action.payload); // using state normalization
      })
      .addCase(updatePost.fulfilled, (state, action: PayloadAction<Post>) => {
        if (!action.payload?.id) {
          console.log("Update could not complete");
          console.log(action.payload);
          return;
        }
        action.payload.date = new Date().toISOString();
        postsAdapter.upsertOne(state, action.payload);
      })
      .addCase(
        deletePost.fulfilled,
        (state, action: PayloadAction<IDeletePost>) => {
          if (!action.payload?.id) {
            console.log("Delete could not complete");
            console.log(action.payload);
            return;
          }
          postsAdapter.removeOne(state, action.payload.id as unknown as string);
        },
      );
  },
});

/* 
getSelectors() creates these selectors and we rename
them with aliases using destructuring
*/

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state: RootState) => state.posts);

export const postActions = postSlice.actions;

export default postSlice.reducer;
