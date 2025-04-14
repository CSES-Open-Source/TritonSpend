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
  (req, res, next) => {
    if (!req.user) {
      console.error("User is undefined during login.");
      return res.status(401).json({ error: "User not authenticated" });
    }
    req.login(req.user, (err) => {
      if (err) {
        console.error("Error during req.login:", err);
        return next(err); // Pass the error to the error handler
      }
      console.log("User logged in:", req.user); // Debug log
      console.log("Session data:", req.session); // Debug log
      res.redirect("http://localhost:8081/"); // Redirect after successful login
    });
  },
);
app.get('/auth/me', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ error: 'Not Authenticated' });
  res.json(req.user);
});
app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
    }
    res.status(200).json({ message: "Logged out successfully" }); // Return success response
  });
});
app.use("/transactions", transactionRoutes);
app.use("/users", userRoutes);
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}.`);
});
