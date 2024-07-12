/**
 * https://redux-toolkit.js.org/tutorials/rtk-query
 * https://redux-toolkit.js.org/rtk-query/usage-with-typescript
 * https://reselect.js.org/api/createselector/
 */

import {
  createEntityAdapter,
  createSelector,
  EntityState,
} from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "../api/apiSlice";
import { TagDescription } from "@reduxjs/toolkit/query";
import { RootState } from "../../store";

// Define the entity adapter
export const postsAdapter = createEntityAdapter<IPost>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

// Get the initial state from the adapter
const initialState = postsAdapter.getInitialState();

// Extend the API slice
export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<EntityState<IPost, string>, void>({
      query: () => "/posts",
      transformResponse: (
        responseData: IPost[],
      ): EntityState<IPost, string> => {
        let min = 1;
        const loadedPosts = responseData.map((post) => {
          if (!post.date) {
            post.date = sub(new Date(), { minutes: min++ }).toISOString();
          }

          if (!post.reactions) {
            post.reactions = {
              thumbsUp: 0,
              heart: 0,
              wow: 0,
              rocket: 0,
              coffee: 0,
            };
          }
          return post;
        });

        // to normalize the state
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result, error, arg) =>
        result
          ? ([
              { type: "Post", id: "LIST" },
              ...result.ids.map((id) => ({ type: "Post", id })),
            ] as TagDescription<"Post">[])
          : ([{ type: "Post", id: "LIST" }] as TagDescription<"Post">[]),
    }),

    getPostsByUserId: builder.query({
      query: (id) => `/posts?userId=${id}`,
      transformResponse: (
        responseData: IPost[],
      ): EntityState<IPost, string> => {
        let min = 1;
        const loadedPosts = responseData.map((post) => {
          if (!post.date) {
            post.date = sub(new Date(), { minutes: min++ }).toISOString();
          }
          if (!post.reactions) {
            post.reactions = {
              thumbsUp: 0,
              heart: 0,
              wow: 0,
              rocket: 0,
              coffee: 0,
            };
          }
          return post;
        });
        // to normalize the state
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result, error, arg) =>
        result
          ? ([
              { type: "Post", id: "LIST" },
              ...result.ids.map((id) => ({ type: "Post", id })),
            ] as TagDescription<"Post">[])
          : ([{ type: "Post", id: "LIST" }] as TagDescription<"Post">[]),
    }),

    addNewPost: builder.mutation<
      EntityState<IPost, string>,
      Omit<IPost, "id" | "reactions" | "date">
    >({
      query: (initialPost) => ({
        url: "/posts",
        method: "POST",
        body: {
          ...initialPost,
          userId: Number(initialPost.userId),
          date: new Date().toISOString(),
          reactions: {
            thumbsUp: 0,
            heart: 0,
            wow: 0,
            rocket: 0,
            coffee: 0,
          } as Record<ReactionType, number>,
        },
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),

    patchPost: builder.mutation<EntityState<IPost, string>, Partial<IPost>>({
      query: (initialPost) => ({
        url: `/posts/${initialPost.id}`,
        method: "PATCH",
        body: {
          ...initialPost,
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
    }),

    updatePost: builder.mutation<
      EntityState<IPost, string>,
      Omit<IPost, "date">
    >({
      query: (initialPost) => ({
        url: `/posts/${initialPost.id}`,
        method: "PUT",
        body: {
          ...initialPost,
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
    }),

    deletePost: builder.mutation<EntityState<IPost, string>, { id: string }>({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
    }),

    addReaction: builder.mutation({
      query: ({ postId, reactions }) => ({
        url: `posts/${postId}`,
        method: "POST",
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reactions },
      }),
      async onQueryStarted(
        { postId, reactions },
        { dispatch, queryFulfilled },
      ) {
        // `updateQueryData` requires the endpoint name and cache key arguments,
        // so it knows which piece of cache state to update
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData(
            "getPosts",
            undefined,
            (draft) => {
              // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
              const post = draft.entities[postId];
              if (post) post.reactions = reactions;
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddReactionMutation,
} = extendedApiSlice;

/** return the whole query result object */
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select();

/** creates memoized selector */
const selectPostsData = createSelector(
  selectPostsResult,
  (postResult) => postResult.data, // normalize state object wit ids & entities
);

/* 
getSelectors() creates these selectors and we rename
them with aliases using destructuring
*/

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors<RootState>(
  (state) => selectPostsData(state) ?? initialState,
);
