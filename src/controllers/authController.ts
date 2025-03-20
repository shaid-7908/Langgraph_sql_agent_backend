import { Request,Response,NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import { userLoginWithEmailAndUserNameService } from "../services/authService";


const userLoginWithEmailAndUserNameController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { user_name_and_email, password } = req.body;
    const { accessToken, refreshToken ,userid} =
      await userLoginWithEmailAndUserNameService(user_name_and_email, password);
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .json({ token: accessToken ,userid:userid});
  }
);

const userLogoutController = asyncHandler(async (req:Request,res:Response,next:NextFunction)=>{

})



export { userLoginWithEmailAndUserNameController };