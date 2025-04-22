declare const store: import("@reduxjs/toolkit").EnhancedStore<{
    webSocket: import("../types/types").WebSocketState;
}, import("redux").UnknownAction, import("@reduxjs/toolkit").Tuple<[import("redux").StoreEnhancer<{
    dispatch: import("redux-thunk").ThunkDispatch<{
        webSocket: import("../types/types").WebSocketState;
    }, undefined, import("redux").UnknownAction>;
}>, import("redux").StoreEnhancer]>>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
