import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";

const Router = express.Router();

Router.post ("/register", registerUser);
Router.post("/login", loginUser);

export default Router;
