import { configureStore } from "@reduxjs/toolkit";
import webSocketReducer from "./webSocketSlice";

const store = configureStore({
  reducer: {
    webSocket: webSocketReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;