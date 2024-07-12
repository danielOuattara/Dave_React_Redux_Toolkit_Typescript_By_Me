# 07 react redux rtk query project

In this Redux advanced tutorial, we will use React, Redux Toolkit, and RTK Query to completely transition a blog project from Axios async thunks to RTK Query, normalized state and optimistic updates.

## (01:05) Starter Source Code

- starter code is the full code from the 05 folder

## (01:46) JSON Server

- copy data from `https://github.com/gitdagray/react_redux_toolkit/blob/main/07_lesson/data/db.json`

- paste to `07-.../data/db.json` . `data` folder is at the root the project folder

- add json-server as local dev dependency

- install json-server as dev-dependency:\
`npm i -D json-server@0.17.4`

- start json-server locally:\
`./node_modules/json-server/lib/cli/bin.js --watch data/db.json --port 3510`

## (03:50) Create an api slice

```ts
// src/features/api/apiSlice.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const URL = "http://localhost:3510";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: URL }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({}),
});
```

## (05:43) Update postSlice to an extended api slice

```ts
/**
 * https://redux-toolkit.js.org/tutorials/rtk-query
 * https://redux-toolkit.js.org/rtk-query/usage-with-typescript
 * https://reselect.js.org/api/createselector/
 */

import { createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { RootState } from "../../store";
import { apiSlice } from "../api/apiSlice";

export const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

// Get the initial state from the adapter
const initialState = postsAdapter.getInitialState();

// Extend the API slice
export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({}),
});

// ...
```

## (08:54) getPosts endpoint method

```ts
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
      providesTags: (result, error, arg) => [
        { type: "Post", id: "LIST" },
        { ...result?.ids.map((id) => ({ type: "Post", id })) },
      ],
    }),
  }),
});
```

## (13:19) Update the postsSlice selectors in postSlice

```ts

export const { useGetPostsQuery } = extendedApiSlice;

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
} = postsAdapter.getSelectors(
  (state) => selectPostsData(state) ?? initialState, // correct types for state
);
```

## (15:50) Reconfigure the store

```ts
import { configureStore } from "@reduxjs/toolkit";

import counterReducer from "./features/counter/counterSlice";
import userReducer from "./features/user/userSlice";
import { apiSlice } from "./features/api/apiSlice";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    users: userReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// infer the 'RootState' and 'AppDispatch' types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// inferred type
export type AppDispatch = typeof store.dispatch;

export default store;
```

## (17:51) Update index.js

```tsx
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { Provider } from "react-redux";
import store from "./store";

import { fetchUsers } from "./features/user/userExtraActions";
import { extendedApiSlice } from "./features/post/postSlice";

store.dispatch(fetchUsers());
store.dispatch(extendedApiSlice.endpoints.getPosts.initiate());

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
```

## (18:59) PostsList component

```tsx
import { useAppSelector } from "./../../hooks";
import PostsExcerpt from "./PostExcerpt";
import { selectPostIds, useGetPostsQuery } from "./postSlice";

export default function PostList() {
  const { isLoading, isSuccess, isError, error } = useGetPostsQuery();
  const orderedPostIds = useAppSelector(selectPostIds);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isSuccess) {
    return (
      <section>
        {orderedPostIds.map((postId) => (
          <PostsExcerpt key={postId} postId={postId} />
        ))}
      </section>
    );
  }

  if (isError) {
    return <p>{error}</p>; // CORRECT type for error
  }
}
```

## (21:18) PostAuthor component

```tsx
import { useAppSelector } from "../../hooks";
import { Link } from "react-router-dom";

export default function PostAuthor({ userId }: { userId: number }) {
  const users = useAppSelector((state) => state.users);

  const author = users.find((user) => user.id === userId);

  return (
    <span>
      by{" "}
      {author ? (
        <Link to={`/user/${userId}`}>{author.name}</Link>
      ) : (
        "Unknown author"
      )}
    </span>
  );
}
```

## (22:21) getPostsByUserId endpoint method

```ts
// /src/features/post/postSlice.ts

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
```

## (24:50) addNewPost endpoint method

```ts
// /src/features/post/postSlice.ts

addNewPost: builder.mutation<
  EntityState<IPost, string>,
  Omit<IPost, "reactions" | "date">
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
        wow: 0,
        rocket: 0,
        coffee: 0,
      },
    },
  }),
}),
```

## (26:09) updatePost endpoint method

```ts
// /src/features/post/postSlice.ts

updatePost: builder.mutation<
  EntityState<IPost, string>,
  Omit<IPost, "date">
>({
  query: (initialPost) => ({
    url: "/posts",
    method: "POST",
    body: {
      ...initialPost,
      date: new Date().toISOString(),
    },
  }),
}),
```

## (27:13) deletePost endpoint method

```ts
// /src/features/post/postSlice.ts

deletePost: builder.mutation<EntityState<IPost, string>, string>({
  query: (id) => ({
    url: `/posts/${id}`,
    method: "POST",
  }),
  invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
}),
```

## (27:58) Export the auto-generated hooks

```ts
// /src/features/post/postSlice.ts

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = extendedApiSlice;
```

## (28:30) AddPostForm component

```tsx
import { useState } from "react";
import { useAppSelector } from "./../../hooks";
import { useAddNewPostMutation } from "./postSlice";
import { useNavigate } from "react-router-dom";

export default function AddPostForm() {
  const [addNewPost, { isLoading }] = useAddNewPostMutation();
  const navigate = useNavigate();
  const users = useAppSelector((state) => state.users);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [userId, setUserId] = useState("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setBody(e.target.value);
  const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setUserId(e.target.value);

  const canSave = [title, body, userId].every(Boolean) && !isLoading;

  const savePost = async () => {
    if (canSave) {
      try {
        await addNewPost({
          title,
          body,
          userId,
        }).unwrap();
        setTitle("");
        setBody("");
        setUserId("");
        navigate("/");
      } catch (error) {
        console.error("Failed to save the post: ", error);
      }
    }
  };

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={(e) => handleTitleChange(e)}
        />

        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={handleAuthorChange}>
          <option value="">-- Select an author --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={body}
          onChange={handleBodyChange}
        />
        <button type="button" onClick={savePost} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
}
```

## (30:57) EditPostForm component

```tsx
import { useState } from "react";
import { useAppSelector } from "./../../hooks";
import { useParams, useNavigate } from "react-router-dom";
import {
  selectPostById,
  useDeletePostMutation,
  useUpdatePostMutation,
} from "./postSlice";
import React from "react";

export default function EditPostForm() {
  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();
  const navigate = useNavigate();
  const { postId } = useParams();

  const post = useAppSelector((state) =>
    selectPostById(state, postId as string),
  );

  const users = useAppSelector((state) => {
    return state.users;
  });

  const [title, setTitle] = useState(post?.title ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [userId, setUserId] = useState(post?.userId ?? "");

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setBody(e.target.value);
  const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setUserId(e.target.value);

  const canSave = [title, body, userId].every(Boolean) && !isLoading;

  const submitSavePost = async () => {
    if (canSave) {
      try {
        await updatePost({
          id: post.id,
          title,
          body: body,
          userId,
          reactions: post.reactions,
        }).unwrap();

        setTitle("");
        setBody("");
        setUserId("");
        navigate(`/post/${postId}`);
      } catch (err) {
        console.error("Failed to save the post", err);
      }
    }
  };

  const submitDeletePost = async () => {
    try {
      await deletePost(post.id).unwrap();
      setTitle("");
      setBody("");
      setUserId("");
      navigate("/");
    } catch (err) {
      console.error("Failed to delete the post", err);
    }
  };

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={handleTitleChange}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={handleAuthorChange}>
          <option value=""></option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={body}
          onChange={handleBodyChange}
        />
        <button type="button" onClick={submitSavePost} disabled={!canSave}>
          Update Post
        </button>
        <button
          className="deleteButton"
          type="button"
          onClick={submitDeletePost}
        >
          Delete Post
        </button>
      </form>
    </section>
  );
}
```

## (33:13) UserPage component

```tsx
import { useAppSelector } from "../../hooks";
import { findUserById } from "./userSlice";
import { Link, useParams } from "react-router-dom";
import { useGetPostsByUserIdQuery } from "../post/postSlice";

export default function UserPage() {
  const { userId } = useParams();

  const user = useAppSelector((state) =>
    findUserById(state, userId as unknown as number),
  );

  const {
    data: userPosts,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsByUserIdQuery(userId);

  if (isLoading) {
    return (
      <section>
        <h2>{user?.name}</h2>
        <p>Loading ...</p>
      </section>
    );
  }

  if (isSuccess) {
    const { ids, entities } = userPosts;
    return (
      <section>
        <h2>{user?.name}</h2>
        <ol>
          {ids.map((id) => (
            <li key={id}>
              <Link to={`/post/${id}`}>{entities[id].title}</Link>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  if (isError) {
    return <p>{error}</p>; // CORRECT error type
  }
}
```

## (36:04) Header component

```tsx
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="Header">
      <h1>Redux Blog</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="post">Post</Link>
          </li>
          <li>
            <Link to="users">Users</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
```

## (37:00) Optimistic Updates for Reactions

```ts
// /src/features/post/postSlice.ts

addReaction: builder.mutation({
  query: ({ postId, reactions }) => ({
    url: `posts/${postId}`,
    method: "PATCH",
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
```

## (42:49) ReactionButtons component

```tsx
import { useAddReactionMutation } from "./postSlice";

const reactionEmoji: Record<ReactionType, string> = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

export default function PostButtonsReaction({ post }: { post: IPost }) {
  const [addReaction] = useAddReactionMutation();
  return (
    <div>
      {Object.entries(reactionEmoji).map(([name, emoji]) => (
        <button
          key={name}
          type="button"
          className="reactionButton"
          onClick={() => {
            const newValue: number = post.reactions[name] + 1; // CORRECT type
            addReaction({
              postId: post.id,
              reactions: { ...post.reactions, [name]: newValue },
            });
          }}
        >
          {emoji} {post.reactions[name]} {/* CORRECT type */}
        </button>
      ))}
    </div>
  );
}
```

## (44:57) View Redux state cache and network requests with dev tools
