import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import db from "src/db/db";
import env from "src/util/validateEnv"; // Importing environment variables

interface UserProfile {
  id: string;
  email: string;
  username: string;
  profile_picture: string | null;
  // Add other fields here based on your `profile` object
}

const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // Extract email from the profile.emails array.
      const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

      // Check that an email is provided and that it ends with @ucsd.edu
      if (!email || !email.toLowerCase().endsWith("@ucsd.edu")) {
        console.error("Not authorized: Only @ucsd.edu emails are allowed.");
        return done(null, false, { message: "Only @ucsd.edu emails are allowed." });
      }

      // Generate a random username (for new users)
      const randomUsername = `user_${Math.floor(Math.random() * 1000000)}`;
      const photos = profile.photos;

      try {
        const checkUserQuery = "SELECT id FROM users WHERE email = $1";
        const result = await db.query(checkUserQuery, [email]);

        if (result.rows.length > 0) {
          // User exists: attach the DB user id to the profile and return
          profile.id = result.rows[0].id;
          return done(null, profile);
        }

        // User does not exist: insert a new user
        const profilePicture = photos && photos.length > 0 ? photos[0].value : null;
        const insertUserQuery = `
          INSERT INTO users (email, username, profile_picture) 
          VALUES ($1, $2, $3) RETURNING id
        `;
        const insertResult = await db.query(insertUserQuery, [
          email,
          randomUsername,
          profilePicture,
        ]);

        profile.id = insertResult.rows[0].id;
        return done(null, profile);
      } catch (err) {
        console.error("Error during user database interaction:", err);
        return done(err);
      }
    },
  ),
);

passport.serializeUser((user: unknown, done) => {
  done(null, user);
});

passport.deserializeUser((user: UserProfile, done) => {
  done(null, user);
});

export default passport;
