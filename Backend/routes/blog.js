import express from "express";
import { Blog } from "../models/blog.js";
import multer from "multer";
import fs from "fs";

const blogRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Create Blog API
blogRouter.post("/create-blog", upload.single("image"), async (req, res) => {
  try {
    let image = req.body.image;

    if (!req.file && !image) {
      image = "./images/default_card_thumbnail/default_card-thumbnail.png";
    } else if (req.file) {
      image = req.file.path;
    }

    const { title, description, owner } = req.body;
    const date = new Date();

    const blog = new Blog({ title, description, image, date, owner });
    await blog.save();

    res.status(200).json({ message: "Blog Posted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Blog Search API
blogRouter.get("/blogsearch", async (req, res) => {
  const { keyword } = req.query;
  try {
    if (!keyword) {
      return res.json([]);
    }
    const blogs = await Blog.find({
      title: { $regex: keyword, $options: "i" },
    });
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Search API using Title or PublishedDate
blogRouter.get("/blog/filterBlogs", async (req, res) => {
  const { title, publishedDate } = req.query;

  try {
    let filter = {};

    if (title) {
      filter.title = title;
    }

    if (publishedDate) {
      filter.publishedDate = publishedDate;
    }

    const blogs = await Blog.find(filter);

    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch Blogs API
blogRouter.get("/fetchblogs", async (req, res) => {
  try {
    // const blogs = await Blog.find();
    const blogs = await Blog.find().populate("owner", "userName");
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch Blog By ID
blogRouter.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate({path: "comments.owner",select: "userName profilephoto"});
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//Update Blog
blogRouter.put("/updateblog/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;
    let updateFields = { title, description };

    if (req.file) {
      const blog = await Blog.findById(req.params.id);
      if (
        blog &&
        blog.image !==
          "./images/default_card_thumbnail/default_card-thumbnail.png"
      ) {
        try {
          fs.unlinkSync(blog.image);
        } catch (err) {
          console.error("Error deleting image file:", err);
        }
      }
      updateFields.image = req.file.path;
    }

    updateFields.date = new Date();

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete Blog
blogRouter.delete("/deleteblog/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    if (
      blog.image !==
      "./images/default_card_thumbnail/default_card-thumbnail.png"
    ) {
      fs.unlinkSync(blog.image);
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// API to post comment
blogRouter.post("/:id/comment", async (req, res) => {
  const id = req.params.id; // Corrected
  const { text, owner } = req.body;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    blog.comments.push({ text, owner });
    await blog.save();
    res.status(200).json({ message: "Comment Added Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// To delete a comment
blogRouter.delete("/:blogid/:commentid", async (req, res) => {
  const blogId = req.params.blogid;
  const commentId = req.params.commentid;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not Found." });
    }
    blog.comments.pull(commentId);
    await blog.save();
    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route for updating a comment
blogRouter.patch("/:blogid/:commentid", async (req, res) => {
  const blogId = req.params.blogid;
  const commentId = req.params.commentid;
  const { text } = req.body;

  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    // Find the index of the comment in the comments array
    const commentIndex = blog.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    // Check if the comment exists in the blog
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found." });
    }

    blog.comments[commentIndex].text = text;
    await blog.save();

    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// To Like a Blog API
blogRouter.post("/:id/like", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the blog by ID
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Increment the likes count
    blog.likes += 1;

    // Save the updated blog
    await blog.save();

    // Return the updated blog
    return res.status(200).json(blog);
  } catch (error) {
    console.error("Error liking blog:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// To Unlike a Blog API
blogRouter.post("/:id/unlike", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the blog by ID
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Decrement the likes count
    blog.likes -= 1;

    // Save the updated blog
    await blog.save();

    // Return the updated blog
    return res.status(200).json(blog);
  } catch (error) {
    console.error("Error unliking blog:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default blogRouter;
