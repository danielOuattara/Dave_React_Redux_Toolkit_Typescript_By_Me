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
