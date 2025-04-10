"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
//import { registerUserService } from "../services/userService";
const zod_1 = require("zod");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dbConnect_1 = require("../config/dbConnect");
const user_schema_1 = require("../drizzle/schema/user.schema");
const drizzle_orm_1 = require("drizzle-orm");
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Name must contain at least 3 characters"),
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(32, "Password must not exceed 32 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&]/, "Password must contain at least one special character (@$!%*?&)"),
    username: zod_1.z.string().min(3, "Username must contain at least 3 character"),
});
class UserController {
}
exports.UserController = UserController;
_a = UserController;
UserController.register = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validRequest = registerSchema.safeParse(req.body);
    if (!validRequest.success) {
        console.log(validRequest.error.errors);
        return res
            .status(400)
            .json(new apiError_1.default(400, "Validation failed", null, validRequest.error.errors));
    }
    const { name, email, password, username } = validRequest.data;
    const hashPassword = yield bcrypt_1.default.hash(password, 10);
    const existingUser = yield dbConnect_1.db
        .select()
        .from(user_schema_1.UserTable)
        .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(user_schema_1.UserTable.email, email), (0, drizzle_orm_1.eq)(user_schema_1.UserTable.username, username)))
        .limit(1);
    if (existingUser.length > 0) {
        return res
            .status(400)
            .json(new apiError_1.default(400, "User or email is taken", null));
    }
    // Insert new user
    const result = yield dbConnect_1.db
        .insert(user_schema_1.UserTable)
        .values({
        name: name,
        email: email,
        password: hashPassword,
        username: username,
    })
        .$returningId();
    return res.status(201).json({
        success: true,
        message: "User registered successfully.",
        data: result,
    });
    // const user = await registerUserService(name, email, password, username);
    // return res
    //   .status(201)
    //   .json({success: user.success ,message:user.message});
}));
const registerController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validRequest = registerSchema.safeParse(req.body);
    if (!validRequest.success) {
        console.log(validRequest.error.errors);
        return res
            .status(400)
            .json(new apiError_1.default(400, "Validation failed", null, validRequest.error.errors));
    }
    const { name, email, password, username } = validRequest.data;
    const hashPassword = yield bcrypt_1.default.hash(password, 10);
    const existingUser = yield dbConnect_1.db
        .select()
        .from(user_schema_1.UserTable)
        .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(user_schema_1.UserTable.email, email), (0, drizzle_orm_1.eq)(user_schema_1.UserTable.username, username)))
        .limit(1);
    if (existingUser.length > 0) {
        return res
            .status(400)
            .json(new apiError_1.default(400, "User or email is taken", null));
    }
    // Insert new user
    const result = yield dbConnect_1.db
        .insert(user_schema_1.UserTable)
        .values({
        name: name,
        email: email,
        password: hashPassword,
        username: username,
    })
        .$returningId();
    return res.status(201).json({
        success: true,
        message: "User registered successfully.",
        data: result,
    });
    // const user = await registerUserService(name, email, password, username);
    // return res
    //   .status(201)
    //   .json({success: user.success ,message:user.message});
}));
