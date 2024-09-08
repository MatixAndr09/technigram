const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

// Users array to store the registered users (In a real application, use a database)
const users = [];

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy for login
passport.use(
  new LocalStrategy(function (username, password, done) {
    const user = users.find((u) => u.username === username);
    if (!user) {
      return done(null, false, { message: "Incorrect username." });
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect password." });
      }
    });
  })
);

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.username);
});

// Deserialize user from the session
passport.deserializeUser((username, done) => {
  const user = users.find((u) => u.username === username);
  done(null, user);
});

// Routes
app.get("/", (req, res) => {
  res.send(
    '<h1>Home</h1><a href="/login">Login</a> <a href="/register">Register</a>'
  );
});

app.get("/login", (req, res) => {
  res.send(
    '<h1>Login</h1><form action="/login" method="post"><div><label>Username:</label><input type="text" name="username"/></div><div><label>Password:</label><input type="password" name="password"/></div><div><input type="submit" value="Log In"/></div></form>'
  );
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureMessage: true,
  })
);

app.get("/register", (req, res) => {
  res.send(
    '<h1>Register</h1><form action="/register" method="post"><div><label>Username:</label><input type="text" name="username"/></div><div><label>Password:</label><input type="password" name="password"/></div><div><input type="submit" value="Register"/></div></form>'
  );
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (user) {
    return res.redirect("/register");
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) throw err;
    users.push({ username, password: hashedPassword });
    res.redirect("/login");
  });
});

app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(
      `<h1>Profile</h1><p>Welcome, ${req.user.username}!</p><a href="/logout">Logout</a>`
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

// Start Server
app.listen(3005, () => {
  console.log("Server started on http://localhost:3005");
});
