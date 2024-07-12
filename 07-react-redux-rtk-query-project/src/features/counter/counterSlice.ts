import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialCounterState = {
  count: 0,
};
const counterSlice = createSlice({
  name: "counter",
  initialState: initialCounterState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },

    decrement: (state) => {
      state.count -= 1;
    },

    reset: (state) => {
      state.count = initialCounterState.count;
    },

    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.count += action.payload;
    },

    decrementByAmount: (state, action: PayloadAction<number>) => {
      state.count -= action.payload;
    },
  },
});

export const counterActions = counterSlice.actions;

export default counterSlice.reducer;
