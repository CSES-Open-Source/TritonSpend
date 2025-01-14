/**
 * Initializes mongoose and express.
 */
import dotenv from 'dotenv';
dotenv.config();

import "module-alias/register";
import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import env from "src/util/validateEnv"; // Importing environment variables
import app from "src/app"; // The express app

const PORT = env.PORT;
const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;

// Setup Passport to use Google OAuth2.0
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Restrict login to UCSD emails only
      if (profile.emails && profile.emails[0].value.endsWith("@ucsd.edu")) {
        return done(null, profile); // Allow login if the email ends with @ucsd.edu
      }
      return done(null, false, { message: "Only UCSD students can log in." }); // Reject others
    }
  )
);

// Serialize and Deserialize user information into the session
passport.serializeUser((user: any, done) => { // Casting user as 'any'
  done(null, user);
});

passport.deserializeUser((user: any, done) => { // Casting user as 'any'
  done(null, user);
});

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

/*

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Mongoose connected!");
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}.`);
    });
  })
  .catch(console.error);
*/