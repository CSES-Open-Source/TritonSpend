#!/bin/bash

# Drop the database if it exists
psql -U postgres -c "DROP DATABASE IF EXISTS tritonspend;"

# Create the new database
psql -U postgres -c "CREATE DATABASE tritonspend;"

# Grant all privileges to the postgres user on the new database
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE tritonspend TO postgres;"

# Run the schema SQL file to create the tables
psql -U postgres -d tritonspend -f ./database.sql

# Grant all privileges on the tables to postgres
psql -U postgres -d tritonspend -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;"

# Ensure future tables also get privileges automatically
psql -U postgres -d tritonspend -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres;"

echo "✅ Database setup complete!"
