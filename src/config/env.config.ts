import env from 'dotenv'

env.config()

const envConfig = {
  PORT: process.env.PORT as string,
  MONGODB_URL: process.env.MONGODB_URI as string,
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME as string,
};

export default envConfig