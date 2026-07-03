import { Pool } from "pg";

const pool = await new Pool({
  host: "db",
  database: Bun.env.POSTGRES_DB,
  port: 5432,
  user: Bun.env.POSTGRES_USER,
  password: Bun.env.POSTGRES_PASSWORD
}).connect();

console.log("Connected to database.");

const query = pool.query.bind(pool);

export {
  query
};