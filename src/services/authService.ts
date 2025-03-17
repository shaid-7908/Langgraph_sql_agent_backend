import { eq, or } from "drizzle-orm";
import { db } from "../config/dbConnect";
import { UserTable } from "../drizzle/schema/user.schema";
import bcrypt from "bcrypt";

export const authentiacteUser = async (
  username_email: string,
  password: string
) => {
  try {
    const user = await db
      .select()
      .from(UserTable)
      .where(
        or(
          eq(UserTable.username, username_email),
          eq(UserTable.email, username_email)
        )
      );
    if (!user.length) throw new Error("User not found");
    // Check if password exists
    const userRecord = user[0];
    if (!userRecord.password) {
      throw new Error("Password not set for this user");
    }
    const isPasswordValid = bcrypt.compare(password, userRecord.password);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
};
