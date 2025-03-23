import { Response, Request, NextFunction } from "express";
//import { registerUserService } from "../services/userService";
import { z } from "zod";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import bcrypt from "bcrypt";
import {db} from '../config/dbConnect'
import { UserTable } from "../drizzle/schema/user.schema";
import { eq, or } from "drizzle-orm";



const registerSchema = z.object({
  name: z.string().min(3, "Name must contain at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must not exceed 32 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[@$!%*?&]/,
      "Password must contain at least one special character (@$!%*?&)"
    ),
  username:z.string().min(3,"Username must contain at least 3 character")
});

const registerController =asyncHandler( async (
  req: Request,
  res: Response,
):Promise<any> => {
  const validRequest = registerSchema.safeParse(req.body);
  if (!validRequest.success) {
    console.log(validRequest.error.errors);
    return res
      .status(400)
      .json(
        new ApiError(400, "Validation failed", null, validRequest.error.errors)
      );
  }

  const { name, email, password, username } = validRequest.data;

  const hashPassword = await bcrypt.hash(password, 10);
  const existingUser = await db
    .select()
    .from(UserTable)
    .where(or(eq(UserTable.email, email), eq(UserTable.username, username)))
    .limit(1);
  if (existingUser.length > 0) {
    return res
      .status(400)
      .json(new ApiError(400, "User or email is taken", null));
  }
  // Insert new user
  const result = await db
    .insert(UserTable)
    .values({
      name: name,
      email: email,
      password: hashPassword,
      username: username,
    })
    .$returningId();
    return res.status(201).json({success:true,message:'User registered successfully.',data:result})

  // const user = await registerUserService(name, email, password, username);
  // return res
  //   .status(201)
  //   .json({success: user.success ,message:user.message});
});

export { registerController }; // ✅ Use named export
