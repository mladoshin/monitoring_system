import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  is_connected: false,
};

export const controllerSlice = createSlice({
  name: "controller",
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.is_connected = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setConnected } = controllerSlice.actions;

export default controllerSlice.reducer;
