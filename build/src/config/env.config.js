"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envConfig = {
    PORT: process.env.PORT,
    // MongoDB Config
    MONGODB_URL: process.env.MONGODB_URL,
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
    // MySQL Config
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_PORT: parseInt(process.env.MYSQL_PORT || "3306", 10),
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_DB_NAME: process.env.MYSQL_DB_NAME,
    JWT_ACCESSTOKEN_SECRET: process.env.JWT_ACCESSTOKEN_SECRET,
    JWT_ACCESSTOKEN_EXPIRES_IN: (_a = process.env.JWT_ACCESSTOKEN_EXPIRES_IN) !== null && _a !== void 0 ? _a : "2h",
    JWT_REFRESHTOKEN_SECRET: process.env.JWT_REFRESHTOKEN_SECRET,
    JWT_REFRESHTOKEN_EXPIRES_IN: (_b = process.env.JWT_REFRESHTOKEN_EXPIRES_IN) !== null && _b !== void 0 ? _b : "10d",
    GROQ_API_KEY: process.env.GROQ_API_KEY
};
exports.default = envConfig;
