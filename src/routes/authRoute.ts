import express from "express";
import { AuthController } from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/login", AuthController.userlogin);

export default authRouter;
