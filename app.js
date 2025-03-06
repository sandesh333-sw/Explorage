if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo'); 
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// Use || to provide a fallback for local development
const dbUrl = process.env.ATLASDB_URL;
const secret = process.env.SECRET || 'thisshouldbeabettersecret';

// Connect to MongoDB with error handling
mongoose.connect(dbUrl)
  .then(() => {
    console.log("connected to DB");
  })
  .catch(err => {
    console.log("MongoDB connection error:", err);
  });

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Configure session store
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
    crypto: {
        secret
    }
});

store.on("error", (err) => {
    console.log("Error in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    name: 'session', // Adding a name for better security
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        // Secure cookies in production
        secure: process.env.NODE_ENV === 'production'
    },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Make user available to all templates
app.use((req, res, next) => {
    // Always set currUser, even if undefined
    res.locals.currUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/demeuser", async(req, res) => {
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "delta"
    });
    let registeredUser = await User.register(fakeUser, "hellohaii");
    res.send(registeredUser);
});
app.get("/", (req, res) => {
    res.redirect("/listings");
});
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// 404 handler
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// Error handler - fixed to prevent multiple headers
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message, statusCode });
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});