// src/auth/googleAuth.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import env from "src/util/validateEnv"; // Importing environment variables

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

export default passport;