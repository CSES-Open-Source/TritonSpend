import { Client } from "pg";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: false});

// Connect to PostgreSQL
client
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL!");
  })
  .catch((err: Error) => {
    console.error("Connection error", err.stack);
  });

// Export client for use in other parts of your app
export default client;
