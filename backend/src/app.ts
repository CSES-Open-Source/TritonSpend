/**
 * Defines server and middleware.
 */

import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { isHttpError } from "http-errors";
import taskRoutes from "src/routes/task";
import multer from "multer";
import path from "path";
const app = express();

// initializes Express to accept JSON in the request/response body
app.use(express.json());

// sets the "Access-Control-Allow-Origin" header on all responses to allow
// requests from the frontend, which has a different origin - see the following
// pages for more info:
// https://expressjs.com/en/resources/middleware/cors.html
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
  }),
);

app.use("/api/task", taskRoutes);

/**
 * Error handler; all errors thrown by server are handled here.
 * Explicit typings required here because TypeScript cannot infer the argument types.
 *
 * An eslint-disable is being used below because the "next" argument is never used. However,
 * it is still required for Express to recognize it as an error handler. For this reason, I've
 * disabled the eslint error. This should be used sparingly and only in situations where the lint
 * error cannot be fixed in another way.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  // 500 is the "internal server error" error code, this will be our fallback
  let statusCode = 500;
  let errorMessage = "An error has occurred.";

  // check is necessary because anything can be thrown, type is not guaranteed
  if (isHttpError(error)) {
    // error.status is unique to the http error class, it allows us to pass status codes with errors
    statusCode = error.status;
    errorMessage = error.message;
  }
  // prefer custom http errors but if they don't exist, fallback to default
  else if (error instanceof Error) {
    errorMessage = error.message;
  }

  res.status(statusCode).json({ error: errorMessage });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save files in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname)); // Add timestamp to file name
  },
});
const upload = multer({ storage: storage });
app.post("/newTransaction", (req, res) => {
  const newTransaction =
    "INSERT INTO transactions(user_id, item_name, amount, category_id) VALUES (?,?,?,?);";
  try {
    const { user_id, item_name, amount, category_id } = req.body;
    if (!user_id || !item_name || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (
      typeof user_id !== "number" ||
      typeof item_name !== "string" ||
      typeof amount !== "number" ||
      (category_id !== null && typeof category_id !== "number")
    ) {
      return res.status(400).json({ error: "Invalid data types" });
    }
    console.log(req.body);
    res.status(200).json({ message: "New Transaction Created!" }); //place holder
    // db.query(newTransaction, [user_id, item_name, amount, category_id], (err, result) => {
    //   if(err){
    //     return res.status(500).json({ error: "Internal server error" });
    //   }
    //   res.status(200).json({ message: "New Transaction Created!" });
    // })
  } catch (error) {
    console.error("Unexpected Error:", error);
    res.status(500).json({ error: "Unexpected server error" });
  }
});
app.post("/updateSettings", upload.single("profile_picture"), (req, res) => {
  const updateSettings =
    "UPDATE users SET username = ?, profile_picture = ?, total_budget = ? WHERE id = ?;";
  try {
    const { username, total_budget, budget_per_category } = req.body;
    const profile_picture = req.file ? req.file.path : null;
    if (!username || !total_budget || !budget_per_category) {
      return res.status(400).json({ error: "Invalid input fields" });
    }
    if (typeof username !== "string" || username.trim() === "" || isNaN(total_budget)) {
      return res.status(400).json({ error: "Invalid data types" });
    }
    const parsedBudgetPerCategory = JSON.parse(budget_per_category);
    for (const category of parsedBudgetPerCategory) {
      console.log(category);
      const categoryBudget = category.total_budget;
      if (isNaN(categoryBudget) || categoryBudget < 0) {
        return res.status(500).json({ error: `Invalid budget for category ID ${category.id}` });
      }
    }
    res.status(200).json({ message: "User Information Updated" }); //place holder
    // db.query(updateSettings, [username, profile_picture, total_budget, budget_per_category], (err, result) => {
    //   if(err){
    //     return res.status(500).json({ error: "Internal server error" });
    //   }
    //   const userId = result.rows[0].id;
    //   const categoryUpdates = Object.entries(budget_per_category).map(([categoryId, budget]) => {
    //       const updateCategoryQuery = `UPDATE categories SET max_category_budget = ? WHERE user_id = ? AND id = ?`;
    //       return db.query(updateCategoryQuery, [budget, userId, categoryId]);
    //   });
    //   Promise.all(categoryUpdates)
    //     .then(() => {
    //         return res.status(200).json({ message: 'Settings updated successfully' });
    //     })
    //     .catch((error) => {
    //         console.error('Error updating categories:', error);
    //         return res.status(500).json({ error: 'Error updating categories' });
    //     });
    // })
  } catch (error) {
    console.error("Unexpected Error:", error);
    res.status(500).json({ error: "Unexpected server error" });
  }
});
export default app;
