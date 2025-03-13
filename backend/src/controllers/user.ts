import { RequestHandler } from "express";
import client from "../db/db"; // Import PostgreSQL client
import multer from "multer";
const upload = multer();

interface Category {
  id: number;
  max_category_budget: string;
}
//Update settings and account information for users
export const updateSettings: RequestHandler = async (req, res) => {
  upload.none()(req, res, async (err) => {
    const updateSettings =
      "UPDATE users SET username = $1, profile_picture = $2, total_budget = $3 WHERE id = $4;";
    //try/catch any errors
    try {
      //retrieve data from body
      const { username, total_budget, id, profile_picture, categories } = req.body;
      //checking for edge cases and validating data
      if (!username || !total_budget) {
        console.log(id);
        return res.status(400).json({ error: "Invalid input fields" });
      }
      if (typeof username !== "string" || username.trim() === "" || isNaN(total_budget)) {
        return res.status(400).json({ error: "Invalid data types" });
      }
      //query
      client.query(updateSettings, [username, profile_picture, total_budget, Number(id)]);
      if (categories) {
        const parsedCategories = JSON.parse(categories);
        const invalidCategory = parsedCategories.find((category: Category) =>
          isNaN(Number(category.max_category_budget)),
        );
        if (invalidCategory) {
          return res.status(400).json({ error: "One or more category budgets are invalid" });
        }
        const updateCategoryQuery =
          "UPDATE categories SET max_category_budget = $1 WHERE id = $2 AND user_id = $3;";
        for (const category of parsedCategories) {
          client.query(updateCategoryQuery, [
            category.max_category_budget,
            category.id,
            Number(id),
          ]);
        }
      }
      res.status(200).json({ message: "Updated Profile Information!" });
    } catch (error) {
      res.status(500).json({ error: `Internal server error: ${error}` });
    }
  });
};

//get transaction list for specific user
export const getUser: RequestHandler = async (req, res) => {
  const { user_id } = req.params;
  const getUser = "SELECT * FROM users WHERE id = $1;";
  try {
    client.query(getUser, [user_id], (err, result) => {
      res.status(200).json(result.rows[0]);
    });
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
};

//get categories for specific user
export const getCategoryForUser: RequestHandler = async (req, res) => {
  const { user_id } = req.params;
  const getCategoryForUser = "SELECT * FROM categories WHERE user_id = $1;";
  try {
    client.query(getCategoryForUser, [user_id], (err, result) => {
      res.status(200).json(result.rows);
    });
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
};
