// server.ts
import dotenv from "dotenv";
dotenv.config();

import "module-alias/register";
import passport from "passport";
import session from "express-session";
import env from "src/util/validateEnv"; // Importing environment variables
import app from "src/app"; // The express app
import "../src/googleAuth"; // Import the Google OAuth logic (this automatically sets up passport)
import transactionRoutes from "./routes/transactions";
import userRoutes from "./routes/user"
const PORT = env.PORT;

// Middleware for handling sessions
app.use(session({ secret: "your_secret_key", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Google login route
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback route
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:8081/NotAuthorized" }),
  (req, res) => {
    res.redirect("http://localhost:8081/Dashboard"); // Redirect after successful login
  },
);
app.use("/transactions", transactionRoutes);
app.use("/users", userRoutes);
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}.`);
});
