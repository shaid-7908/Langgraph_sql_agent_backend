"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
const env_config_1 = __importDefault(require("./src/config/env.config"));
exports.default = (0, drizzle_kit_1.defineConfig)({
    dialect: "mysql",
    schema: "./src/drizzle/schema/",
    out: "./src/drizzle/migrations",
    dbCredentials: {
        host: env_config_1.default.MYSQL_HOST,
        database: env_config_1.default.MYSQL_DB_NAME,
        port: env_config_1.default.MYSQL_PORT,
        password: env_config_1.default.MYSQL_PASSWORD,
        user: env_config_1.default.MYSQL_USER
    },
    verbose: true,
    strict: true
});
