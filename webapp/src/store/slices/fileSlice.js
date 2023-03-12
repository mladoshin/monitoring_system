import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    value: {}
}

export const counterSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setFiles: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setFiles } = counterSlice.actions

export default counterSlice.reducer