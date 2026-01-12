import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js"
import connectDB from "./config/connect.js";
import cors from 'cors'
const app = express();
// how to generate a rendom characters for your secret in "bash terminal"
// openssl rand -base64 32
dotenv.config();

app.use(cors())
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("api/books", bookRoutes)

connectDB();

const PORT = process.env.PORT || 8880;
app.listen(PORT, () => {
  console.log("server started on port", PORT);
});
app.get("/", (req, res) => {
  res.status(200).send("you just used my api");
});
