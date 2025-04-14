import { RequestHandler } from "express";
import client from "../db/db"; // Import PostgreSQL client

export const updateUserSettings: RequestHandler = async (req, res, next) => {
  console.log("Received data:", req.body); // Debugging step

  const { username, profilePicture, totalBudget, categoryBudgets } = req.body;

  try {
    // First, get the userId by username
    const getUserIdQuery = `
            SELECT id FROM users WHERE username = $1;
        `;
    const userResult = await client.query(getUserIdQuery, [username]);

    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userResult.rows[0].id; // Extract the userId from the result

    // Update user details
    const updateUserQuery = `
            UPDATE users
            SET username = $1, profile_picture = $2, total_budget = $3
            WHERE id = $4
            RETURNING *;
        `;

    await client.query(updateUserQuery, [username, profilePicture, totalBudget, userId]);

    // Update category budgets if provided
    if (categoryBudgets && Object.keys(categoryBudgets).length > 0) {
      for (const [categoryName, budget] of Object.entries(categoryBudgets)) {
        await client.query(
          `UPDATE categories SET max_category_budget = $1 WHERE user_id = $2 AND category_name = $3;`,
          [budget, userId, categoryName],
        );
      }
    }

    res.status(200).json({ message: "User settings updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return next(err);
    }
    console.log("Logout successful.");
    res.status(200).json({ message: "Logout successful", loggedIn: false });
  });
};

// In your getUserStatus controller:
export const getUserStatus: RequestHandler = async (req, res, next) => {
  console.log("getUserStatus called");
  console.log("req.session:", req.session);
  console.log("req.user:", req.user);
  try {
    if (!req.user) {
      console.log("User not authenticated");
      return res.status(401).json({ loggedIn: false, message: "User not authenticated" });
    }
    // ... rest of your code
  } catch (error) {
    console.error("Error in getUserStatus:", error);
    next(error);
  }
};
