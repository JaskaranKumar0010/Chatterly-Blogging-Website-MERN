const express = require("express"); // 1 to 5 lines are Mandatory
const app = express();

const port = 8000;
app.use(express.json());

const books = [
  {
    id: 1,
    title: "Book 1",
    author: "Jaskaran",
    username:"mjass",
    email:"jaskran@gmail.com"
  },
  {
    id: 2,
    title: "Book 2",
    author: "Mandeep",
    username:"mandeep",
    email:"mandeep@gmail.com"
  },
];

app.get("/books", (req, res) => {
  // console.log("Hello I am a Backend Developer");
  // res.send('Hello Express');
  res.json(books);
});

app.get("/books/:id",(req,res) => {
    const id = req.params.id;
    const book = books.find((item) => item.id == id);
    if(!book){
        return res.status(404).json({message: "Book doesn't exist"})
    }
    else{
        res.json(book)
    }
});

app.patch("/books/:id", (req,res) => {
  const id = req.params.id
  const update = req.body;
  const bookIndex = books.findIndex((item) => item.id == id);
  const updatedbook = {...books[bookIndex],...update}
  books[bookIndex] = updatedbook;
  res.json(updatedbook)
});

app.put("/books/:id", (req,res) => {
  const id = req.params.id
  const bookIndex = books.findIndex((item) => item.id == id);
  if(bookIndex === -1){
    return res.status(400).json({message:'Book Not Found!'})
  }
  else{
    const { title, author, username, email } = req.body
    books[bookIndex] = { id, title, author, username, email }
    res.json(books[bookIndex])
  }
})

app.delete("/books/:id",(req,res) => {
    const id = req.params.id
    const bookIndex = books.findIndex((item) => item.id == id)
    if(!bookIndex){
        return res.status(404).json({message: "Book doesn't exist"})
    }
    else {
        books.splice(bookIndex, 1);
        res.json({ message: "Book deleted successfully", books: books });
    }
});

app.post("/books", (req, res) => {
  const { title, author, username, email } = req.body;
  const id = books.length + 1;
  const newbook = { id, title, author, username, email };
  books.push(newbook);
  res.status(201).json(newbook);
});


app.listen(port, () => {
  console.log(` Server is running on http://localhost:${port}`
  );
});
