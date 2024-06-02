import mongoose from "mongoose";

const BlogSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  date: { type: Date },
  comments: [
    {
      text: { type: String, required: true },
      owner: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  owner: { type: String, required: true },
  likes: { type: Number, default: 0 }
});

export const Blog = mongoose.model("Blog", BlogSchema);
