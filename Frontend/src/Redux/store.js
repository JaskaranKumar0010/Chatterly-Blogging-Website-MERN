import { configureStore } from "@reduxjs/toolkit";
import { blogSlice } from "./reducers/blogSlice";

export const store = configureStore({
    reducer:{
        // counter: counterSlice.reducer,
        blogs : blogSlice.reducer
    }
})