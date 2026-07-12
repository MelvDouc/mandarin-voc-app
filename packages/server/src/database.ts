import { Pool } from "pg";

const poolClient = await new Pool({
  host: "db",
  database: process.env.POSTGRES_DB,
  port: 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
}).connect();

console.log("🔓 Connected to database.");

const query = poolClient.query.bind(poolClient);

export {
  query
};