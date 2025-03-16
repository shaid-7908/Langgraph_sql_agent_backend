import express from "express";
import { registerController } from "../controllers/userController"; // ✅ Use named import

const userRouter = express.Router();

userRouter.post("/register", registerController);

export default userRouter


