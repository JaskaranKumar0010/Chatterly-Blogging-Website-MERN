import { createSlice } from "@reduxjs/toolkit";
import { getBlogs } from "../actions/blog";

const initialState = {
  allblogs: [],
  loading: false,
  error: null
};

export const blogSlice = createSlice({
    name: "blogSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(getBlogs.pending, (state) => {
        state.loading = true;
      });
  
      builder.addCase(getBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.allblogs = action.payload;
      });
  
      builder.addCase(getBlogs.rejected, (state, action) => {
        state.loading = false;
        state.allblogs = action.payload;
      });
    },
  });
