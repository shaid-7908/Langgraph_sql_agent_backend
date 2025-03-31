import mysql from 'mysql2/promise'


const agentDbConnection = async (): Promise<mysql.Connection | null> => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Shahid@79",
    database: "wokrmate_banking",
  });
  return connection;
};

export {agentDbConnection}