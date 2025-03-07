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

-- initialize default categories 
INSERT INTO categories (id, user_id, category_name, max_category_budget, category_expense) 
VALUES 
    (1, 1, 'Food', 3123.00, 50.00),
    (2, 1, 'Shopping', 123.00, 240.00),
    (3, 1, 'Transportation', 56.00, 200.00),
    (4, 1, 'Subscriptions', 78.00, 350.00),
    (5, 1, 'other', 90.00, 777.00);


-- initialize default user
INSERT INTO users (id, email, username, profile_picture, total_budget, total_expense)
VALUES
    (3,'TritonKing@ucsd.edu', 'TritonKing', NULL, 1500, 1000)