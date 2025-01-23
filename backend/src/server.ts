// server.ts
import dotenv from 'dotenv';
dotenv.config();

import "module-alias/register";
import passport from "passport";
import session from "express-session";
import env from "src/util/validateEnv"; // Importing environment variables
import app from "src/app"; // The express app
import './googleAuth'; // Import the Google OAuth logic (this automatically sets up passport)

const PORT = env.PORT;

// Middleware for handling sessions
app.use(session({ secret: "your_secret_key", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Google login route
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback route
app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard"); // Redirect after successful login
  }
);

// Dashboard route
app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`<h1>Welcome to your Dashboard</h1>`); // Simplified, no display name
  } else {
    res.redirect("/"); // Redirect if not authenticated
  }
});

// Home route (for failure or non-UCSD email login)
app.get("/", (req, res) => {
  res.send("<h1>Only UCSD students can log in. Please use your UCSD email to sign up.</h1>");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}.`);
});
