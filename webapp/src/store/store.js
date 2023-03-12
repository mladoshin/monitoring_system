import { configureStore } from '@reduxjs/toolkit'
import fileReducer from './slices/fileSlice'

export const store = configureStore({
  reducer: {
    files: fileReducer
  },
})