import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import {
  addNewPost,
  deletePost,
  fetchPosts,
  updatePost,
} from "./postExtraActions";
import { RootState } from "../../store";

const postInitialState: IPostInitialState = {
  posts: [],
  status: "idle",
  error: null,
};

//-------

const postSlice = createSlice({
  name: "post",
  initialState: postInitialState,
  reducers: {
    addPost: {
      reducer(state, action: PayloadAction<Post>) {
        state.posts.push(action.payload);
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
      const existingPost = state.posts.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
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
        state.posts = [...state.posts, ...loadedPosts];
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
        state.posts.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action: PayloadAction<Post>) => {
        if (!action.payload?.id) {
          console.log("Update could not complete");
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        action.payload.date = new Date().toISOString();
        const posts = state.posts.filter((post) => post.id !== id);
        state.posts = [...posts, action.payload];
      })
      // .addCase(
      //   deletePost.fulfilled,
      //   (state, action: PayloadAction<IDeletePost>) => {
      //     if (!action.payload?.id) {
      //       console.log("Update could not complete");
      //       console.log(action.payload);
      //       return;
      //     }
      //     const posts = state.posts.filter(
      //       (post) => post.id !== action.payload.id.toString(),
      //     );
      //     state.posts = posts;
      //   },
      // );
      .addCase(
        deletePost.fulfilled,
        (state, action: PayloadAction<IDeletePost>) => {
          const { id } = action.payload;
          state.posts = state.posts.filter((post) => post.id !== id.toString());
        },
      );
  },
});

export const findPostById = (
  state: RootState,
  postId: number,
): Post | undefined =>
  state.posts.posts.find((post) => Number(post.id) === postId);

export const postActions = postSlice.actions;

export default postSlice.reducer;
