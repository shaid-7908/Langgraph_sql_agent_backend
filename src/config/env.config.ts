import env from "dotenv";

env.config();

const envConfig = {
  PORT: process.env.PORT as string,

  // MongoDB Config
  MONGODB_URL: process.env.MONGODB_URL as string,
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME as string,

  // MySQL Config
  MYSQL_HOST: process.env.MYSQL_HOST as string,
  MYSQL_PORT: parseInt(process.env.MYSQL_PORT || '3306', 10),
  MYSQL_USER: process.env.MYSQL_USER as string,
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD as string,
  MYSQL_DB_NAME: process.env.MYSQL_DB_NAME as string,
};

export default envConfig;
