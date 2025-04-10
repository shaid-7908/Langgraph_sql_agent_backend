"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mysql2_1 = require("drizzle-orm/mysql2");
const promise_1 = __importDefault(require("mysql2/promise"));
const env_config_1 = __importDefault(require("./env.config"));
// Create a MySQL connection pool
const pool = promise_1.default.createPool({
    host: env_config_1.default.MYSQL_HOST,
    port: env_config_1.default.MYSQL_PORT,
    user: env_config_1.default.MYSQL_USER,
    password: env_config_1.default.MYSQL_PASSWORD,
    database: env_config_1.default.MYSQL_DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Limit connections
    queueLimit: 0,
});
exports.db = (0, mysql2_1.drizzle)(pool, { logger: true });
