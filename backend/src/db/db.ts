// Importing the pg library for PostgreSQL
import { Client } from 'pg';

// Create a new client instance with your connection details
const client = new Client({
  host: 'localhost',        // Database host (localhost for local database)
  port: 5432,               // Default PostgreSQL port
  user: 'your_db_user',     // Your PostgreSQL username (replace with your actual username)
  password: 'your_db_pass', // Your PostgreSQL password (replace with your actual password)
  database: 'tritonspend'   // Name of your database (you might have to create it first)
});

// Connect to PostgreSQL
client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL!');
  })
  .catch((err) => {
    console.error('Connection error', err.stack);
  });

// Export client for use in other parts of your app
export default client;
