// Load .env only in local development, NOT in Kubernetes
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

console.log("SECRET from env:", process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// Routers
const listingsRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review");
const userRouter = require("./routes/user");

// Use ATLASDB_URL from Kubernetes Secret
const dbUrl = process.env.ATLASDB_URL;

// Fallback only for local development
const secret = process.env.SECRET || "thisshouldbeabettersecret";

// Connect to MongoDB
mongoose.connect(dbUrl)
  .then(() => console.log("connected to DB"))
  .catch(err => console.log("MongoDB connection error:", err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Session store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600,
  crypto: { secret }
});

store.on("error", (err) => {
  console.log("Error in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  }
};

app.use(session(sessionOptions));
app.use(flash());

// Passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Template globals
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Test route
app.get("/demeuser", async (req, res) => {
  let fakeUser = new User({
    email: "student@gmail.com",
    username: "delta"
  });
  let registeredUser = await User.register(fakeUser, "hellohaii");
  res.send(registeredUser);
});

// Redirect root
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// Kubernetes health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// 404
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Error handler
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error", { message, statusCode });
});

// Server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
