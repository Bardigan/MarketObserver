import { configureStore } from "@reduxjs/toolkit";
import webSocketReducer from "./webSocketSlice";
const store = configureStore({
    reducer: {
        webSocket: webSocketReducer,
    },
});
export default store;
