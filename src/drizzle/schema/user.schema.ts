import { mysqlTable, varchar, int } from "drizzle-orm/mysql-core";

export const UserTable = mysqlTable("user", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }),
  email:varchar('email',{length:255}),
  username:varchar('username',{length:255}),
  password:varchar('password',{length:255}),
  refreshToken:varchar('refresh_token',{length:255}),
});
