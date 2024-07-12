import { createSelector, createSlice } from "@reduxjs/toolkit";
import { fetchUsers } from "./userExtraActions";
import { RootState } from "../../store";
import { selectAllPosts } from "../post/postSlice";

const usersInitialState: IUsersInitialState[] = [];

const userSlice = createSlice({
  name: "user",
  initialState: usersInitialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (_state, action) => {
      return action.payload;
    });
  },
});

export const findUserById = (state: RootState, userId: number) => {
  return state.users.find((user) => user.id === userId);
};

export const selectUserPosts = createSelector(
  [selectAllPosts, (state: RootState, userId: string) => userId],
  (posts, userId: string) => posts.filter((post) => post.userId === userId),
);

export const userAction = userSlice.actions;

export default userSlice.reducer;
