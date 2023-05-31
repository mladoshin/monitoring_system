import { configureStore } from '@reduxjs/toolkit'
import fileReducer from './slices/fileSlice'
import missionReducer from "./slices/missionSlice"

export const store = configureStore({
  reducer: {
    files: fileReducer,
    mission: missionReducer
  },
})