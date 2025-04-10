import { Request,Response,NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import { UserTable } from "../drizzle/schema/user.schema";
import { db } from "../config/dbConnect";
import { or,eq } from "drizzle-orm";

import ApiError from "../utils/apiError";
import bcrypt from 'bcrypt'
import { generateAccessToken,generateRefreshToken } from "../utils/generateToken";


const userLoginWithEmailAndUserNameController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { user_name_and_email, password } = req.body;
    const user = await db
      .select()
      .from(UserTable)
      .where(
        or(
          eq(UserTable.username, user_name_and_email),
          eq(UserTable.email, user_name_and_email)
        )
      );
    if (!user.length) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }
    const userRecord = user[0];
    if (!userRecord.password) {
      return res
        .status(400)
        .json(new ApiError(400, "Password not set for this user"));
    }
    // Await the password comparison for correct asynchronous handling.
    const isPasswordValid = await bcrypt.compare(password, userRecord.password);
    if (!isPasswordValid) {
      return res.status(401).json(new ApiError(401, "Invalid password"));
    }
    //generate both token
    const accessToken = generateAccessToken(userRecord.id);
    const refreshToken = generateRefreshToken(userRecord.id);
    //update refresh token to db
    const updateResult = await db
      .update(UserTable)
      .set({ refreshToken: refreshToken })
      .where(eq(UserTable.id, userRecord.id));
      if(updateResult[0].affectedRows <1){
        return res.status(500).json(new ApiError(500,'Failed to update refresh token'))
      }
    
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .json({ token: accessToken ,userid:userRecord.id});
  }
);

const userLogoutController = asyncHandler(async (req:Request,res:Response,next:NextFunction)=>{

})

class AuthController {
  static userlogin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { user_name_and_email, password } = req.body;
      const user = await db
        .select()
        .from(UserTable)
        .where(
          or(
            eq(UserTable.username, user_name_and_email),
            eq(UserTable.email, user_name_and_email)
          )
        );
      if (!user.length) {
        return res.status(404).json(new ApiError(404, "User not found"));
      }
      const userRecord = user[0];
      if (!userRecord.password) {
        return res
          .status(400)
          .json(new ApiError(400, "Password not set for this user"));
      }
      // Await the password comparison for correct asynchronous handling.
      const isPasswordValid = await bcrypt.compare(
        password,
        userRecord.password
      );
      if (!isPasswordValid) {
        return res.status(401).json(new ApiError(401, "Invalid password"));
      }
      //generate both token
      const accessToken = generateAccessToken(userRecord.id);
      const refreshToken = generateRefreshToken(userRecord.id);
      //update refresh token to db
      const updateResult = await db
        .update(UserTable)
        .set({ refreshToken: refreshToken })
        .where(eq(UserTable.id, userRecord.id));
      if (updateResult[0].affectedRows < 1) {
        return res
          .status(500)
          .json(new ApiError(500, "Failed to update refresh token"));
      }

      return res
        .status(200)
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        })
        .json({ token: accessToken, userid: userRecord.id });
    }
  );
}



export { AuthController };