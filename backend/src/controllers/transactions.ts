import { RequestHandler } from "express";
import client from "../db/db"; // Import PostgreSQL client

//adding new transaction
export const addTransaction: RequestHandler = async (req, res) => {
  const newTransaction =
    "INSERT INTO transactions(user_id, item_name, amount, category_name) VALUES ($1,$2,$3,$4);";
  //try/catch any errors
  try {
    //retrieve data from body
    const { user_id, item_name, amount, category_name } = req.body;
    //checking for edge cases and validating data

    if (!user_id || !item_name || !amount || item_name.length == 0 || amount <= 0) {
      return res.status(400).json({ error: "Invalid fields" });
    }
    if (
      typeof user_id !== "number" ||
      typeof item_name !== "string" ||
      typeof amount !== "number" ||
      (category_name !== null && typeof category_name !== "string")
    ) {
      return res.status(400).json({ error: "Invalid data types" });
    }

    // Only insert the transaction - let the database trigger handle category_expense update
    await client.query(newTransaction, [user_id, item_name, amount, category_name]);

    res.status(200).json({ message: "New Transaction Created!" });
  } catch (error) {
    console.error("Unexpected Error:", error);
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
};

//get transaction list for specific user
export const getTransactions: RequestHandler = async (req, res) => {
  const { user_id } = req.params;
  const getTransactions = "SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC;";
  try {
    client.query(getTransactions, [user_id], (err, result) => {
      res.status(200).json(result.rows);
    });
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
};

// delete a specific transaction for a specific user
export const deleteTransaction: RequestHandler = async (req, res) => {
  const { user_id, transaction_id } = req.params;

  // Validate input
  if (!user_id || !transaction_id) {
    return res.status(400).json({ error: "Missing user_id or transaction_id" });
  }

  try {
    const deleteQuery = "DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *;";
    const result = await client.query(deleteQuery, [transaction_id, user_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Transaction not found or does not belong to user" });
    }

    // No need to manually update category_expense - the database trigger handles it
    console.log(result.rows[0]);
    res.status(200).json({ message: "Transaction deleted successfully", deleted: result.rows[0] });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
};

// Get monthly spending for a specfic user, which is further divided into categories.
export const getMonthlyByCategory: RequestHandler = async (req, res) => {
  const { user_id } = req.params;
  const { startDate, endDate } = req.query;
  const ID_MATCH = /^\d+$/;
  const DATE_MATCH = /^\d{4}-\d{2}-\d{2}$/;

  const getQuery =
    "SELECT DATE_TRUNC('month', date)::DATE as month, " +
    "COALESCE(category_name, 'Total') as category, SUM(amount) FROM transactions " +
    "WHERE user_id = $1 AND date::DATE BETWEEN " +
    "COALESCE($2, '1970-01-01'::DATE) AND COALESCE($3, CURRENT_DATE) " +
    "GROUP BY ROLLUP(month, category_name) ORDER BY month DESC;";

  // Validate input.
  if (!user_id || !user_id.match(ID_MATCH)) {
    return res.status(400).json({ error: "Missing or invalid user_id" });
  }
  if (startDate && (typeof startDate !== "string" || !startDate.match(DATE_MATCH))) {
    return res.status(400).json({
      error: "Invalid date format, should be YYYY-MM-DD",
    });
  }
  if (endDate && (typeof endDate !== "string" || !endDate.match(DATE_MATCH))) {
    return res.status(400).json({
      error: "Invalid date format, should be YYYY-MM-DD",
    });
  }

  try {
    client.query(getQuery, [user_id, startDate, endDate], (err, result) => {
      res.status(200).json(result.rows);
    });
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
};
