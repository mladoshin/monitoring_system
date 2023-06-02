import { configureStore } from "@reduxjs/toolkit";
import fileReducer from "./slices/fileSlice";
import missionReducer from "./slices/missionSlice";
import { AppAPI } from "./api";

export const store = configureStore({
  reducer: {
    files: fileReducer,
    mission: missionReducer,
    [AppAPI.reducerPath]: AppAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(AppAPI.middleware),
});
