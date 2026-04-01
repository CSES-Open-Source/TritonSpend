import { Client } from "pg";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase
  },
});

// Connect to Supabase PostgreSQL
client
  .connect()
  .then(() => {
    console.log("Connected to Supabase PostgreSQL!");
  })
  .catch((err: Error) => {
    console.error("Connection error", err.stack);
  });

// Export client for use in other parts of your app
export default client;
