import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  status: null
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
  },
});

// Action creators are generated for each case reducer function
export const { setLoading, setSuccess, setError } = missionSlice.actions;

export default missionSlice.reducer;
