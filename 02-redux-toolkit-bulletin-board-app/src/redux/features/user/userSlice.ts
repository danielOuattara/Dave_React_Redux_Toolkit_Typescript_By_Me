import { createSlice } from "@reduxjs/toolkit";

const usersInitialState = [
  { id: "0", name: "Dude Lebowski" },
  { id: "1", name: "Neil Young" },
  { id: "2", name: "Dave Gray" },
];

const userSlice = createSlice({
  name: "user",
  initialState: usersInitialState,
  reducers: {},
});

export const userAction = userSlice.actions;

export default userSlice.reducer;
