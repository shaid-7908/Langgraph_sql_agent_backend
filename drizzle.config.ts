import {defineConfig} from 'drizzle-kit'
import envConfig from './src/config/env.config';

export default defineConfig({
  dialect: "mysql",
  schema: "./src/drizzle/schema/",
  out: "./src/drizzle/migrations",
  dbCredentials:{
    host:envConfig.MYSQL_HOST,
    database:envConfig.MYSQL_DB_NAME,
    port:envConfig.MYSQL_PORT,
    password:envConfig.MYSQL_PASSWORD,
    user:envConfig.MYSQL_USER
  },
  verbose:true,
  strict:true
});