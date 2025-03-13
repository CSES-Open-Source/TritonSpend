/**
 * Defines server and middleware.
 */

import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { isHttpError } from "http-errors";
import taskRoutes from "src/routes/task";
import client from "../src/db/db";
import multer from "multer";
const app = express();
const upload = multer();
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

//  ↓ Organize these endpoints into routes later ↓
// interface Category {
//   id: number;
//   max_category_budget: string;
// }

//updating user account settings
// app.put("/updateSettings", upload.none(), (req, res) => {
//   const updateSettings =
//     "UPDATE users SET username = $1, profile_picture = $2, total_budget = $3 WHERE id = $4;";
//   //try/catch any errors
//   try {
//     //retrieve data from body
//     const { username, total_budget, id, profile_picture, categories } = req.body;
//     //checking for edge cases and validating data
//     if (!username || !total_budget) {
//       console.log(username);
//       return res.status(400).json({ error: "Invalid input fields" });
//     }
//     if (typeof username !== "string" || username.trim() === "" || isNaN(total_budget)) {
//       return res.status(400).json({ error: "Invalid data types" });
//     }
//     //query
//     client.query(updateSettings, [username, profile_picture, total_budget, Number(id)]);
//     if (categories) {
//       const parsedCategories = JSON.parse(categories);
//       const invalidCategory = parsedCategories.find((category: Category) =>
//         isNaN(Number(category.max_category_budget)),
//       );
//       if (invalidCategory) {
//         return res.status(400).json({ error: "One or more category budgets are invalid" });
//       }
//       const updateCategoryQuery =
//         "UPDATE categories SET max_category_budget = $1 WHERE id = $2 AND user_id = $3;";
//       for (const category of parsedCategories) {
//         client.query(updateCategoryQuery, [category.max_category_budget, category.id, Number(id)]);
//       }
//     }
//     res.status(200).json({ message: "Updated Profile Information!" });
//   } catch (error) {
//     res.status(500).json({ error: `Internal server error: ${error}` });
//   }
// });

//get specific user info
// app.get("/getUser/:user_id", (req, res) => {
//   const { user_id } = req.params;
//   const getUser = "SELECT * FROM users WHERE id = $1;";
//   try {
//     client.query(getUser, [user_id], (err, result) => {
//       res.status(200).json(result.rows[0]);
//     });
//   } catch (error) {
//     res.status(500).json({ error: `Internal server error: ${error}` });
//   }
// });

//get categories for specific user
// app.get("/getCategoryForUser/:user_id", (req, res) => {
//   const { user_id } = req.params;
//   const getCategoryForUser = "SELECT * FROM categories WHERE user_id = $1;";
//   try {
//     client.query(getCategoryForUser, [user_id], (err, result) => {
//       res.status(200).json(result.rows);
//     });
//   } catch (error) {
//     res.status(500).json({ error: `Internal server error: ${error}` });
//   }
// });
export default app;
