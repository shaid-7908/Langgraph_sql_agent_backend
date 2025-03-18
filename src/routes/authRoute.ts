import express from "express";
import { userLoginWithEmailAndUserName } from "../controllers/authController";


const authRouter = express.Router()

authRouter.post('/login',userLoginWithEmailAndUserName)

export default authRouter