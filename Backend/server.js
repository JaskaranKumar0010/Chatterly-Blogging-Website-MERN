import express, { json } from "express";
import mongoose from "mongoose";
import validator from "validator";
import dotenv from "dotenv";
dotenv.config();
const app = express();

const port = process.env.PORT || 3000;
app.use(json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(
      " ------------------------------------------------ Database is connected ----------------------------------------------- "
    );
  })
  .catch((error) => {
    console.log("Database is not connected", error);
  });

const bookSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
});

const Book = mongoose.model("Book", bookSchema);

app.post("/books", async (req, res) => {
  const book = new Book({
    userName: req.body.userName,
    email: req.body.email,
    title: req.body.title,
    author: req.body.author,
  });
  try {
    const newBook = await book.save();
    res.status(201).json(new Book());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/books", async (req, res) => {
  const result = await Book.find();
  res.status(200).json(result);
});

// Delete api using id
// app.delete('/books/:id', async (req, res) =>{
//   try{
//     const id = req.params.id;
//   const book = await Book.findByIdAndDelete(id);
//   if(!book) {
//     return res.status(404).json({ message: '  No book with that ID' })
//   }
//   res.json({message:"Book deleted successfully"},book);
//   }
//   catch(error){
//     console.log(error,"This error occured")
//   }
// })

// Delete book by id
// app.delete("/books/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const deletedBook = await Book.findOneAndDelete({ _id: id });
//     if (deletedBook) {
//       res.status(200).json({ message: "Book deleted successfully", deletedBook });
//     }
//     else {
//       res.status(404).json({ message: "Book not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Failed to delete book", error: error.message });
//   }
// });

// Delete Book by title
app.delete("/books", async (req, res) => {
  const { title } = req.query;
  try {
    const deletedBook = await Book.findOneAndDelete({ title });
    if (deletedBook) {
      res.status(200).json({ message: "Book deleted successfully", deletedBook });
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete book", error: error.message });
  }
});

// Put api to update the book
app.put("/books/:id", async (req, res) => {
  const id = req.params.id;
  const { userName, email, title, author } = req.body;
  if (!userName || !email || !title || !author) {
    return res.status(400).json("All fields are required");
  } else if (!validator.isEmail(email)) {
    res.status(400).json({ message: "Please enter valid email id" });
  } else {
    try {
      const updateBook = await Book.findByIdAndUpdate(
        id,
        { userName, email, title, author },
        { new: true } // To show updated data in the response
      );
      res.json(updateBook);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
});

app.patch("/books/:id", async (req, res) => {
  const id = req.params.id;
  const { userName, email, title, author } = req.body;

  if (email && !validator.isEmail(email)) {
    return res.status(400).json({ message: "Please enter a valid email" });
  }
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { userName, email, title, author },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({message:"Book updated successfully",updatedBook});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(` Server is running on http://localhost:${port}`);
});
