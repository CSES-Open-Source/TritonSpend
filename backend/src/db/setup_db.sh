#!/bin/bash

# Drop the database if it exists
psql -U postgres -c "DROP DATABASE IF EXISTS tritonspend;"

# Create the new database
psql -U postgres -c "CREATE DATABASE tritonspend;"

# Run the schema SQL file to create the tables
psql -d tritonspend -f ./database.sql

echo "✅ Database setup complete!"
