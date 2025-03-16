import { Response, Request } from "express";
import { registerUserservice } from "../services/userService";
import { z } from "zod";

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

const registerController = async (
  req: Request,
  res: Response
):Promise<any> => {
  const validRequest = registerSchema.safeParse(req.body);
  if (!validRequest.success) {
    return res.status(400).json({ zod_erro: validRequest });
  }

  const { name, email, password ,username} = validRequest.data;
  try {
    const user = await registerUserservice(name, email, password,username);
    return res
      .status(201)
      .json({success: user.success ,message:user.message});
  } catch (error) {
    return res.status(500).json({success:false, message: "Internal server error" });
  }
};

export { registerController }; // ✅ Use named export
