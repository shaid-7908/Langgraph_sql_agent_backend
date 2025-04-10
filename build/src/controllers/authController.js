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
exports.AuthController = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const user_schema_1 = require("../drizzle/schema/user.schema");
const dbConnect_1 = require("../config/dbConnect");
const drizzle_orm_1 = require("drizzle-orm");
const apiError_1 = __importDefault(require("../utils/apiError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = require("../utils/generateToken");
const userLoginWithEmailAndUserNameController = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_name_and_email, password } = req.body;
    const user = yield dbConnect_1.db
        .select()
        .from(user_schema_1.UserTable)
        .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(user_schema_1.UserTable.username, user_name_and_email), (0, drizzle_orm_1.eq)(user_schema_1.UserTable.email, user_name_and_email)));
    if (!user.length) {
        return res.status(404).json(new apiError_1.default(404, "User not found"));
    }
    const userRecord = user[0];
    if (!userRecord.password) {
        return res
            .status(400)
            .json(new apiError_1.default(400, "Password not set for this user"));
    }
    // Await the password comparison for correct asynchronous handling.
    const isPasswordValid = yield bcrypt_1.default.compare(password, userRecord.password);
    if (!isPasswordValid) {
        return res.status(401).json(new apiError_1.default(401, "Invalid password"));
    }
    //generate both token
    const accessToken = (0, generateToken_1.generateAccessToken)(userRecord.id);
    const refreshToken = (0, generateToken_1.generateRefreshToken)(userRecord.id);
    //update refresh token to db
    const updateResult = yield dbConnect_1.db
        .update(user_schema_1.UserTable)
        .set({ refreshToken: refreshToken })
        .where((0, drizzle_orm_1.eq)(user_schema_1.UserTable.id, userRecord.id));
    if (updateResult[0].affectedRows < 1) {
        return res.status(500).json(new apiError_1.default(500, 'Failed to update refresh token'));
    }
    return res
        .status(200)
        .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    })
        .json({ token: accessToken, userid: userRecord.id });
}));
const userLogoutController = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
}));
class AuthController {
}
exports.AuthController = AuthController;
_a = AuthController;
AuthController.userlogin = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_name_and_email, password } = req.body;
    const user = yield dbConnect_1.db
        .select()
        .from(user_schema_1.UserTable)
        .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(user_schema_1.UserTable.username, user_name_and_email), (0, drizzle_orm_1.eq)(user_schema_1.UserTable.email, user_name_and_email)));
    if (!user.length) {
        return res.status(404).json(new apiError_1.default(404, "User not found"));
    }
    const userRecord = user[0];
    if (!userRecord.password) {
        return res
            .status(400)
            .json(new apiError_1.default(400, "Password not set for this user"));
    }
    // Await the password comparison for correct asynchronous handling.
    const isPasswordValid = yield bcrypt_1.default.compare(password, userRecord.password);
    if (!isPasswordValid) {
        return res.status(401).json(new apiError_1.default(401, "Invalid password"));
    }
    //generate both token
    const accessToken = (0, generateToken_1.generateAccessToken)(userRecord.id);
    const refreshToken = (0, generateToken_1.generateRefreshToken)(userRecord.id);
    //update refresh token to db
    const updateResult = yield dbConnect_1.db
        .update(user_schema_1.UserTable)
        .set({ refreshToken: refreshToken })
        .where((0, drizzle_orm_1.eq)(user_schema_1.UserTable.id, userRecord.id));
    if (updateResult[0].affectedRows < 1) {
        return res
            .status(500)
            .json(new apiError_1.default(500, "Failed to update refresh token"));
    }
    return res
        .status(200)
        .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    })
        .json({ token: accessToken, userid: userRecord.id });
}));
