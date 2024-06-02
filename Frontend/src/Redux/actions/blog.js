import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchblogs } from "../../API/endpoint";

export const getBlogs = createAsyncThunk("blog/getBlogs", async()=>{
    try{
        const response = await fetchblogs()
        return response.data
    }
     catch (error) {
        console.error("Error fetching blogs:", error);
    }
})