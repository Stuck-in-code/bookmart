import express from "express";
import { deleteABook, getABookById, getAllBooks, getBooksByUser, postABook, updateABook } from "../controllers/bookControllers.js";
import protectRoute from "../middleware/auth.middleware.js";

const Router = express.Router();

Router.get("/", getAllBooks);
Router.get("/user", getBooksByUser)
Router.post("/",protectRoute, postABook);
Router.get("/:id", getABookById );
Router.delete("/:id", deleteABook);
Router.put("/:id", updateABook);

export default Router;
