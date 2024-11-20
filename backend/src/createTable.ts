import { Pool } from 'pg';

// Set up the PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',        // Default user for PostgreSQL
  host: 'localhost',       // Host where PostgreSQL is running
  database: 'my_transactions', // Your PostgreSQL database name
  password: '',            // Leave empty if no password is set for the 'postgres' user
  port: 5432,              // Default PostgreSQL port
});

// Define the SQL query to create the table
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL
  );
`;

// Run the SQL query to create the table
async function createTable() {
  try {
    const client = await pool.connect();
    console.log("Connected to the database!");

    // Execute the query to create the table
    await client.query(createTableQuery);
    console.log("Table created successfully (if it didn't already exist).");

    // Release the connection back to the pool
    client.release();
  } catch (err) {
    console.error("Error creating table:", err);
  } finally {
    // Close the connection pool
    await pool.end();
  }
}

// Call the function to create the table
createTable();
