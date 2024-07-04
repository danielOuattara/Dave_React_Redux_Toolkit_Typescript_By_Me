import { createAction, nanoid } from "@reduxjs/toolkit";

export const addPost = createAction(
  "post/addPost",
  function prepare(title, content) {
    return {
      payload: {
        id: nanoid(),
        title,
        content,
      },
    };
  },
);
