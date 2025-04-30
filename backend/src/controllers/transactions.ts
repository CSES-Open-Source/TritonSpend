import { RequestHandler } from "express";
import client from "../db/db"; // Import PostgreSQL client

//adding new transaction
export const addTransaction: RequestHandler = async (req, res) => {
  const newTransaction =
    "INSERT INTO transactions(user_id, item_name, amount, category_id) VALUES ($1,$2,$3,$4);";
  //try/catch any errors
  try {
    //retrieve data from body
    const { user_id, item_name, amount, category_id } = req.body;
    //checking for edge cases and validating data

    if (!user_id || !item_name || !amount || item_name.length == 0 || amount <= 0) {
      return res.status(400).json({ error: "Invalid fields" });
    }
    if (
      typeof user_id !== "number" ||
      typeof item_name !== "string" ||
      typeof amount !== "number" ||
      (category_id !== null && typeof category_id !== "number")
    ) {
      return res.status(400).json({ error: "Invalid data types" });
    }
    //query
    client.query(newTransaction, [user_id, item_name, amount, category_id]);
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
