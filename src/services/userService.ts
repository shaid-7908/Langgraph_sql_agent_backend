import { db } from "../config/dbConnect";
import { UserTable } from "../drizzle/schema/user.schema";
import bcrypt from "bcrypt";
import {eq} from 'drizzle-orm'
import ApiError from "../utils/apiError";

export const registerUserService = async (
  name: string,
  email: string,
  password: string,
  username: string
) => {
  const hashPassword = await bcrypt.hash(password, 10);

  try {
    // Check if username already exists
    const existingUser = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.username,username))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, message: "Username is already taken" };
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

    return { success: true, message: result };
  } catch (error:any) {
    console.error("Error registering user:", error);
    //throw new Error(`User registration failed ${error}`);
    throw new ApiError(500,'Db connection error',null,error)
  }
};
