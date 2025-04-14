import dotenv from "dotenv";
dotenv.config();

import "module-alias/register";
import passport from "passport";
import session from "express-session";
import env from "src/util/validateEnv"; // Importing environment variables
import app from "src/app"; // The express app
import "../src/googleAuth"; // Import the Google OAuth logic (this automatically sets up passport)
import userRoutes from "../src/routes/user";
import cors from "cors";

// Allow only specific origins (example: http://localhost:3000)
const allowedOrigins = [
  "http://localhost:8081", // Change this to the frontend's origin
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Check if the origin is in the allowedOrigins list
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS"), false); // Reject the request
      }
    },
    credentials: true, // Allow cookies/session data to be sent
  }),
);

const PORT = env.PORT;

// Middleware for handling sessions
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use true for https
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour expiration time
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// Google login route
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback route
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:8081/NotAuthorized" }),
  (req, res) => {
    res.redirect("http://localhost:8081/Login"); // Redirect after successful login
  },
);

app.use("/user", userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}.`);
});
