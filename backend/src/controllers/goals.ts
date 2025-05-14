import { RequestHandler } from "express";
import client from "../db/db"; // Import PostgreSQL client

// //adding new transaction
// export const addTransaction: RequestHandler = async (req, res) => {
//   const newTransaction =
//     "INSERT INTO transactions(user_id, item_name, amount, category_id) VALUES ($1,$2,$3,$4);";
//   //try/catch any errors
//   try {
//     //retrieve data from body
//     const { user_id, item_name, amount, category_id } = req.body;
//     //checking for edge cases and validating data

//     if (!user_id || !item_name || !amount || item_name.length == 0 || amount <= 0) {
//       return res.status(400).json({ error: "Invalid fields" });
//     }
//     if (
//       typeof user_id !== "number" ||
//       typeof item_name !== "string" ||
//       typeof amount !== "number" ||
//       (category_id !== null && typeof category_id !== "number")
//     ) {
//       return res.status(400).json({ error: "Invalid data types" });
//     }
//     //query
//     client.query(newTransaction, [user_id, item_name, amount, category_id]);
//     res.status(200).json({ message: "New Transaction Created!" });
//   } catch (error) {
//     console.error("Unexpected Error:", error);
//     res.status(500).json({ error: `Internal server error: ${error}` });
//   }
// };

// Get Goal
export const getGoals: RequestHandler = async (req, res) => {
  const { user_id } = req.params;
  const getGoals = "SELECT * FROM goals WHERE user_id = $1;";
  try {
    client.query(getGoals, [user_id], (err, result) => {
      if (err) {
        console.error("Query Error:", err);
        return res.status(500).json({ error: "Database query error" });
      }
      res.status(200).json(result.rows);
    });
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
};

// Add Goal
export const addGoal: RequestHandler = async (req, res) => {
  const newGoal =
    "INSERT INTO goals(user_id, title, details, target_date) VALUES ($1, $2, $3, $4) RETURNING *;";
  try {
    const { user_id, title, details, target_date } = req.body;

    if (!user_id || !title) {
      return res.status(400).json({ error: "Invalid fields" });
    }
    client.query(newGoal, [user_id, title, details, target_date], (err, result) => {
      if (err) {
        console.error("Query Error:", err);
        return res.status(500).json({ error: "Database query error" });
      }
      res.status(200).json(result.rows[0]);
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
};

// Edit goal
export const editGoal: RequestHandler = async (req, res) => {
  const { id, user_id, title, details, target_date } = req.body;
  const updateGoal = `
    UPDATE goals 
    SET title = $1, details = $2, target_date = $3 
    WHERE id = $4 AND user_id = $5;
  `;

  try {
    if (!id || !user_id || !title) {
      return res.status(400).json({ error: "Invalid fields" });
    }
    client.query(updateGoal, [title, details, target_date, id, user_id]);
    res.status(200).json({ message: "Goal updated successfully" });
  } catch (error) {
    console.error("Update Goal Error:", error);
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
};

// Delete Goal
export const deleteGoal: RequestHandler = async (req, res) => {
  const { id, user_id } = req.body;

  if (!id || !user_id) {
    return res.status(400).json({ error: "Missing id or user_id" });
  }

  const deleteQuery = "DELETE FROM goals WHERE id = $1 AND user_id = $2;";

  try {
    await client.query(deleteQuery, [id, user_id]);
    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    console.error("Delete Goal Error:", error);
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
};
