import {drizzle} from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import envConfig from './env.config';

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: envConfig.MYSQL_HOST,
  port: envConfig.MYSQL_PORT,
  user: envConfig.MYSQL_USER,
  password: envConfig.MYSQL_PASSWORD,
  database: envConfig.MYSQL_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Limit connections
  queueLimit: 0,
});
export const db = drizzle(pool,{ logger:true})



