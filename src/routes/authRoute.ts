import express from "express";
import { userLoginWithEmailAndUserNameController } from "../controllers/authController";


const authRouter = express.Router()

authRouter.post("/login", userLoginWithEmailAndUserNameController);

export default authRouter