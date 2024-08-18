import { createConnection } from "mysql2/promise";

const connection = await createConnection(process.env.DB_URI);
console.log("Connected to database.");
const query = connection.query.bind(connection);
const execute = connection.execute.bind(connection);

export {
  execute, query
};
