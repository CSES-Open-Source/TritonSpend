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
    category_name VARCHAR(100) NOT NULL,  -- Category Name
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Date of Transaction
);

-- Create Goals Table
CREATE TABLE goals (
    id SERIAL PRIMARY KEY,                           -- Goal ID (Auto Increment)
    user_id INT REFERENCES users(id) ON DELETE CASCADE, -- User ID (FK)
    title VARCHAR(100) NOT NULL,                     -- Goal Title
    details TEXT,                                    -- Goal Details (optional)
    target_date DATE                                 -- Target Date (optional)
);

CREATE OR REPLACE FUNCTION create_default_categories()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO categories (user_id, category_name, max_category_budget, category_expense)
  VALUES
    (NEW.id, 'Food', 0.00, 0.00),
    (NEW.id, 'Shopping', 0.00, 0.00),
    (NEW.id, 'Transportation', 0.00, 0.00),
    (NEW.id, 'Subscriptions', 0.00, 0.00),
    (NEW.id, 'Other', 0.00, 0.00);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_default_categories
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION create_default_categories();
