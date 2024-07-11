#  06 react redux rtk query crud example

- start json-server locally: `./node_modules/json-server/lib/bin.js --watch data/db.json --port 350`

## (00:46) Project dependencies

```json
  "dependencies": {
    "@fortawesome/fontawesome-svg-core": "^6.5.2",
    "@fortawesome/free-solid-svg-icons": "^6.5.2",
    "@fortawesome/react-fontawesome": "^0.2.2",
    "@reduxjs/toolkit": "^2.2.6",
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.101",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-redux": "^9.1.2",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5",
    "web-vitals": "^2.1.4"
  },
    "devDependencies": {
     "json-server": "^0.17.4"
  }
  ```

## (01:41) React v18 index changes

```tsx
// /src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

## (02:17) JSON Server

- install json-server as dev-dependency:\
`npm i -D json-server`

- start json-server locally:\
`./node_modules/json-server/lib/cli/bin.js --watch data/db.json --port 3510`

## (03:48) App and TodoList components

```tsx
// src/App.tsx
import TodoList from "./features/todos/TodoList";
export default function App() {
return <TodoList />;
}
```

## (05:07) Create an api slice

- `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src", "*.d.ts"]
}

```

- `types.d.ts`

```ts
interface ITodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  date: number;
}
```

- `todoApi.ts`

```ts
// src/features/todos/api/todoApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "todoApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3510" }),
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => "/todos",
    }),
  }),
});

export const { useGetTodosQuery } = todoApi;
```

## (08:47) ApiProvider

- wrap `App.tsx` with `ApiProvider` component and `todoApi` api

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { todoApi } from "./features/api/todoApi";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <ApiProvider api={todoApi}>
      <App />
    </ApiProvider>
  </React.StrictMode>,
);

```

## (09:57) Apply useGetTodosQuery in TodoList

```tsx
// /src/features/todos/TodoList.jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useGetTodosQuery } from "../api/todoApi";

export default function TodoList() {
  const [newTodo, setNewTodo] = useState("");

  const {
    data: todos,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTodosQuery();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //addTodo
    setNewTodo("");
  };

  return (
    <main>
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="new-todo">Enter a new todo item</label>
        <div className="new-todo">
          <input
            type="text"
            id="new-todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter new todo"
          />
        </div>
        <button className="submit">
          <FontAwesomeIcon icon={faUpload} />
        </button>
      </form>
      {isLoading && <p>Loading...</p>}
      {!isLoading && isSuccess && JSON.stringify(todos)}
      {isError && <p>{error}</p>}
    </main>
  );
}
```

## (12:30) Adding mutations to the slice

```ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const todoApi = createApi({
  reducerPath: "todoApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3510" }),
  tagTypes: ["Todos"],
  endpoints: (builder) => ({
    getTodos: builder.query<ITodo[], void>({
      query: () => ({
        url: "/todos",
      }),
    }),
    addTodo: builder.mutation({
      query: (todo) => ({
        url: "/todos",
        method: "POST",
        body: todo,
      }),
    }),
      updateTodo: builder.mutation<ITodo, ITodo>({
      query: (todo) => ({
        url: `/todos/${todo.id}`,
        method: "PUT",
        body: todo,
      }),
    }),
    patchTodo: builder.mutation<ITodo, Partial<ITodo>>({
      query: (todo) => ({
        url: `/todos/${todo.id}`,
        method: "PATCH",
        body: todo,
      }),
    }),
    deleteTodo: builder.mutation<{ id: number }, number>({
      query: (id) => ({
        url: `/todos/${id}`,
        method: "DELETE",
        body: id,
      }),
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  usePatchTodoMutation,
  useDeleteTodoMutation,
} = todoApi;

```

## (15:21) Apply mutation hooks in TodoList

```tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  //   usePatchTodoMutation,
  useDeleteTodoMutation,
} from "../api/todoApi";

import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

export default function TodoList() {
  const [newTodo, setNewTodo] = useState("");

  const {
    data: todos,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTodosQuery();

  const [addTodo] = useAddTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  //   const [patchTodo] = usePatchTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTodo({
      userId: 1,
      title: newTodo,
      completed: false,
    });
    setNewTodo("");
  };

  let errorMessage: string | null = null;

  if (isError) {
    if ("status" in error) {
      // FetchBaseQueryError
      const fetchBaseQueryError = error as FetchBaseQueryError;
      errorMessage =
        "error" in fetchBaseQueryError
          ? fetchBaseQueryError.error
          : JSON.stringify(fetchBaseQueryError.data);
    } else {
      // SerializedError
      const serializedError = error as SerializedError;
      errorMessage = serializedError.message ?? "An unknown error occurred";
    }
  }

  return (
    <main>
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="new-todo">Enter a new todo item</label>
        <div className="new-todo">
          <input
            type="text"
            id="new-todo"
            value={newTodo}
            placeholder="Enter new todo"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewTodo(e.target.value)
            }
          />
        </div>
        <button className="submit">
          <FontAwesomeIcon icon={faUpload} />
        </button>
      </form>
      {isLoading && <p>Loading...</p>}
      {!isLoading &&
        isSuccess &&
        todos.map((todo) => (
          <article key={todo.id}>
            <div className="todo">
              <input
                type="checkbox"
                name="completed"
                id="completed"
                onChange={() =>
                  updateTodo({ ...todo, completed: !todo.completed })
                }
              />
              <label htmlFor={todo.id.toString()}>{todo.title}</label>
            </div>
            <button className="trash" onClick={() => deleteTodo(todo.id)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </article>
        ))}
      {isError && <p>{errorMessage}</p>}
    </main>
  );
}

```

## (18:08) Cached data

```ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const todoApi = createApi({
  reducerPath: "todoApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3510" }),
  tagTypes: ["Todos"],
  endpoints: (builder) => ({
    getTodos: builder.query<ITodo[], string>({
      query: () => ({
        url: "/todos",
      }),
      providesTags: ["Todos"],
    }),
    addTodo: builder.mutation({
      query: (todo) => ({
        url: "/todos",
        method: "POST",
        body: todo,
      }),
      invalidatesTags: ["Todos"],
    }),
    updateTodo: builder.mutation({
      query: (todo) => ({
        url: `/todos/${todo.id}`,
        method: "PUT",
        body: todo,
      }),
      invalidatesTags: ["Todos"],
    }),
    patchTodo: builder.mutation({
      query: (todo) => ({
        url: `/todos/${todo.id}`,
        method: "PATCH",
        body: todo,
      }),
      invalidatesTags: ["Todos"],
    }),
    deleteTodo: builder.mutation({
      query: (id) => ({
        url: `/todos/${id}`,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["Todos"],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  usePatchTodoMutation,
  useDeleteTodoMutation,
} = todoApi;
```

## (19:14) Tags, invalidating cache, and auto-refetching

```ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const todoApi = createApi({
  reducerPath: "todoApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3510" }),
  tagTypes: ["Todos"],
  endpoints: (builder) => ({
    getTodos: builder.query<ITodo[], void>({
      query: () => "/todos",
      transformResponse: (res: ITodo[]) => res.sort((a, b) => b.date - a.date),
      providesTags: ["Todos"],
      }),

      //...
  })
})

```

## (21:48) Transforming the response
