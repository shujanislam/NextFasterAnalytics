import { Pool } from "pg";

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT || 5432,
  max: process.env.POSTGRES_MAX || 10,
  idleTimeoutMillis: process.env.POSTGRES_IDLE_TIMEOUT || 30000,
  connectionTimeoutMillis: process.env.POSTGRES_CONNECTION_TIMEOUT || 5000,
  keepAlive: process.env.POSTGRES_KEEP_ALIVE || true,
});

pool.on("connect", () => {
  // console.log('pool working');
});

pool.on("error", (err) => {
  console.log(err.message);
});

export default pool;
