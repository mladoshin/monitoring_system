import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  is_connected: false,
  loading: false
};

export const controllerSlice = createSlice({
  name: "controller",
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.is_connected = action.payload;
    },
    startLoading: (state, payload) => {
        state.loading = true;
    },
    stopLoading: (state, payload) => {
        state.loading = false;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setConnected, startLoading, stopLoading } = controllerSlice.actions;

export default controllerSlice.reducer;
