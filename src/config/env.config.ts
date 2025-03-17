import env from "dotenv";

env.config();

const envConfig = {
  PORT: process.env.PORT as string,

  // MongoDB Config
  MONGODB_URL: process.env.MONGODB_URL as string,
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME as string,

  // MySQL Config
  MYSQL_HOST: process.env.MYSQL_HOST as string,
  MYSQL_PORT: parseInt(process.env.MYSQL_PORT || "3306", 10),
  MYSQL_USER: process.env.MYSQL_USER as string,
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD as string,
  MYSQL_DB_NAME: process.env.MYSQL_DB_NAME as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '2h'
};

export default envConfig;
