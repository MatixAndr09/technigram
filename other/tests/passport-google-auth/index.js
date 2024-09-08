//   clientID:
//     "319754961686-mrebsu8nlc7h2vrgvm4osfi6sp2unb96.apps.googleusercontent.com",
//   clientSecret: "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",
//   callbackURL: "http://localhost:3005/auth/google/callback",

const express = require("express");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();

// Session middleware
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// User serialization
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "1018719524838-7p1djmo9b4nkm8osvt0jbp37fup7ba9l.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3005/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Here, you would save the user profile to your database
      return done(null, profile);
    }
  )
);

// Routes
app.get("/", (req, res) => {
  res.send('<h1>Home</h1><a href="/auth/google">Login with Google</a>');
});

app.get("/login", (req, res) => {
  res.send('<h1>Login Page</h1><a href="/auth/google">Login with Google</a>');
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/profile");
  }
);

app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(
      `<h1>Hello ${req.user.displayName}</h1><a href="/logout">Logout</a>`
    );
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Start server on port 3005
app.listen(3005, () => {
  console.log("Server is running on http://localhost:3005");
});
