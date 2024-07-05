import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { postInitialState } from "./postInitialState";
// import { addPost } from "./postActions";

const initialState: Post[] = postInitialState;

// Infer the type of a single post:  OK
// type Post = (typeof initialState)[number];

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    addPost: {
      reducer(state, action: PayloadAction<Post>) {
        state.push(action.payload);
      },
      prepare({
        title,
        content,
        userId,
      }: Omit<Post, "id" | "reactions" | "date">) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
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
      const existingPost = state.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      } else {
        return;
      }
    },
  },

  /* OK */
  // extraReducers: (builder) => {
  //   builder.addCase(addPost, (state, action) => {
  //     state.push(action.payload);
  //   });
  // },
});

export const postActions = postSlice.actions;

export default postSlice.reducer;
