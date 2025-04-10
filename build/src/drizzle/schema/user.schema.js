"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTable = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
exports.UserTable = (0, mysql_core_1.mysqlTable)("user", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    name: (0, mysql_core_1.varchar)("name", { length: 255 }),
    email: (0, mysql_core_1.varchar)('email', { length: 255 }),
    username: (0, mysql_core_1.varchar)('username', { length: 255 }),
    password: (0, mysql_core_1.varchar)('password', { length: 255 }),
    refreshToken: (0, mysql_core_1.varchar)('refresh_token', { length: 255 }),
});
