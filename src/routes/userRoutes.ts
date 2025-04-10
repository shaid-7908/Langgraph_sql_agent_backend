import express from "express";
import { UserController } from "../controllers/userController"; // ✅ Use named import

const userRouter = express.Router();

userRouter.post("/register", UserController.register);

export default userRouter


