import { Request,Response,NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import { userLoginWithEmailAndUserNameService } from "../services/authService";


const userLoginWithEmailAndUserName = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { user_name_and_email, password } = req.body;
    const { accessToken, refreshToken } =
      await userLoginWithEmailAndUserNameService(user_name_and_email, password);
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .json({ token: accessToken });
  }
);



export {userLoginWithEmailAndUserName}