import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const todoApi = createApi({
  reducerPath: "todoApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3510" }),
  tagTypes: ["Todos"],
  endpoints: (builder) => ({
    getTodos: builder.query<ITodo[], void>({
      query: () => "/todos",
      transformResponse: (res: ITodo[]) => res.sort((a, b) => b.id - a.id),
      providesTags: ["Todos"],
    }),
    addTodo: builder.mutation<ITodo, Omit<ITodo, "id" | "date">>({
      query: (todo) => {
        const date = Date.now();
        return {
          url: "/todos",
          method: "POST",
          body: { ...todo, date },
        };
      },
      invalidatesTags: ["Todos"],
    }),
    updateTodo: builder.mutation<ITodo, ITodo>({
      query: (todo) => ({
        url: `/todos/${todo.id}`,
        method: "PUT",
        body: todo,
      }),
      invalidatesTags: ["Todos"],
    }),
    patchTodo: builder.mutation<ITodo, Partial<ITodo>>({
      query: (todo) => ({
        url: `/todos/${todo.id}`,
        method: "PATCH",
        body: todo,
      }),
      invalidatesTags: ["Todos"],
    }),
    deleteTodo: builder.mutation<{ id: number }, number>({
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
