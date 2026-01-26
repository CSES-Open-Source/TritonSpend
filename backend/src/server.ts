// server.ts
import dotenv from "dotenv";
dotenv.config();

import "module-alias/register";
import passport from "passport";
import session from "express-session";
import env from "src/util/validateEnv"; // Importing environment variables
import app from "src/app"; // The express app
import "../src/googleAuth"; // Import the Google OAuth logic (this automatically sets up passport)
import transactionRoutes from "../src/routes/transactions";
import userRoutes from "../src/routes/user";
import goalsRoutes from "../src/routes/goals";
const PORT = env.PORT;

// Middleware for handling sessions
app.use(session({ secret: "your_secret_key", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Google login route
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" }),
);

// Google callback route
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:8081/",
    failureRedirect: "http://localhost:8081/NotAuthorized",
  }),
);
app.get("/auth/me", (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ error: "Not Authenticated" });
  res.json(req.user);
});
app.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
    }
    res.status(200).json({ message: "Logged out successfully" }); // Return success response
  });
});
app.use("/transactions", transactionRoutes);
app.use("/users", userRoutes);
app.use("/goals", goalsRoutes);
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}.`);
});
