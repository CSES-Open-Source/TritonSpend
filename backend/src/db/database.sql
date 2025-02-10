-- Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,                    -- User ID (Auto Increment)
    email VARCHAR(255) UNIQUE NOT NULL,        -- Email (Unique)
    username VARCHAR(100) UNIQUE NOT NULL,     -- Username (Unique)
    profile_picture TEXT,                     -- Profile Picture (Optional)
    total_budget DECIMAL(10,2) DEFAULT 0.00,  -- Total Budget
    total_expense DECIMAL(10,2) DEFAULT 0.00  -- Total Expenses
);

-- Create Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,                    -- Category ID (Auto Increment)
    user_id INT REFERENCES users(id) ON DELETE CASCADE,  -- User ID (FK)
    category_name VARCHAR(100) NOT NULL,       -- Category Name
    max_category_budget DECIMAL(10,2) DEFAULT 0.00,  -- Max Category Budget
    category_expense DECIMAL(10,2) DEFAULT 0.00      -- Category Expense
);

-- Create Transactions Table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,                    -- Transaction ID (Auto Increment)
    user_id INT REFERENCES users(id) ON DELETE CASCADE,  -- User ID (FK)
    item_name VARCHAR(255) NOT NULL,           -- Item Name
    amount DECIMAL(10,2) NOT NULL,             -- Amount of the Transaction
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,  -- Category ID (FK)
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Date of Transaction
);
