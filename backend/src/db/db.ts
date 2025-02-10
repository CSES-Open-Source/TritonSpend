// db.ts
import { Client } from "pg";

const client = new Client({
  host: "localhost", // Database host (localhost for local database)
  port: 5432, // Default PostgreSQL port
  user: "your_user", // Your PostgreSQL username
  password: "your_password", // Your PostgreSQL password
  database: "tritonspend", // Name of your database
});

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
