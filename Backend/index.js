import express from "express"; // 1 to 4 lines are Mandatory
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";
import path, { dirname, join } from "path";
dotenv.config();
import authRouter from "./routes/auth.js";
import blogRouter from "./routes/blog.js";
const app = express();
const port = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/blog", blogRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.use("/images", express.static(join(__dirname, "images")));
app.use('/profilepics', express.static(path.join(__dirname, 'profilepics')));

mongoose.connect(process.env.MONGO_URI, {
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

app.listen(port, () => {
  console.log(` Server is running on http://localhost:${port}`);
});
