import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./features/post/postSlice";
import counterReducer from "./features/counter/counterSlice";
import userReducer from "./features/user/userSlice";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    posts: postReducer,
    users: userReducer,
  },
});

// infer the 'RootState' and 'AppDispatch' types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// inferred type
export type AppDispatch = typeof store.dispatch;

export default store;
