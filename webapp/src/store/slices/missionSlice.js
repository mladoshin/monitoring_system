import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: null,
  metrics: [],
  counter16: 1,
  counter32: 1,
};

export const missionSlice = createSlice({
  name: "mission",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.status = 2;
    },
    setSuccess: (state, action) => {
      state.status = 0;
    },
    setError: (state, action) => {
      state.status = 1;
    },
    setMetrics: (state, action) => {
      state.metrics = action.payload;
    },
    incrementCounter16: (state, action) => {
      state.counter16++;
    },
    setCounter16: (state, action) => {
      state.counter16 = +action.payload;
    },
    incrementCounter32: (state, action) => {
      state.counter32++;
    },
    setCounter32: (state, action) => {
      state.counter32 = +action.payload;
    },
    resetCounters: (state, action) => {
      state.counter16 = 1;
      state.counter32 = 1;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setLoading,
  setSuccess,
  setError,
  setMetrics,
  incrementCounter16,
  incrementCounter32,
  resetCounters,
  setCounter16,
  setCounter32,
} = missionSlice.actions;

export default missionSlice.reducer;
