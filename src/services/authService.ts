import { eq, or } from "drizzle-orm";
import { db } from "../config/dbConnect";
import { UserTable } from "../drizzle/schema/user.schema";
import bcrypt from "bcrypt";
import ApiError from "../utils/apiError";
import { generateAccessToken,generateRefreshToken } from "../utils/generateToken";

const userLoginWithEmailAndUserNameService = async (
  username_email: string,
  password: string
) => {
  try {
    // Retrieve the user matching either the username or email.
    const users = await db
      .select()
      .from(UserTable)
      .where(
        or(
          eq(UserTable.username, username_email),
          eq(UserTable.email, username_email)
        )
      );

    if (!users.length) {
      // User not found
      throw new ApiError(404, "User not found");
    }

    const userRecord = users[0];

    if (!userRecord.password) {
      // Password not set for this user
      throw new ApiError(400, "Password not set for this user");
    }

    // Await the password comparison for correct asynchronous handling.
    const isPasswordValid = await bcrypt.compare(password, userRecord.password);

    if (!isPasswordValid) {
      // Password does not match
      throw new ApiError(401, "Invalid password");
    }
    //generate both token
    const accessToken = generateAccessToken(userRecord.id)
    const refreshToken = generateRefreshToken(userRecord.id)

    //update refresh token to db
    const updateResult = await db
      .update(UserTable)
      .set({ refreshToken: refreshToken })
      .where(eq(UserTable.id, userRecord.id));
      
      //if failed to update throw error
      if(updateResult[0].affectedRows <1){
        throw new ApiError(500,'Failed update refreshToken')
      }
      return {accessToken,refreshToken}
      
  } catch (error: any) {
    console.error("Error authenticating user:", error);
    // Rethrow a standardized API error for centralized error handling.
    throw new ApiError(500, "Database related error", null, error);
  }
};

export {userLoginWithEmailAndUserNameService}