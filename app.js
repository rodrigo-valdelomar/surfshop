const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const bodyParser = require("body-parser");
const User = require("./models/user");
const session = require("express-session");
const mongoose = require("mongoose");

// require routes
const indexRouter = require("./routes/index");
const posts = require("./routes/posts");
const reviews = require("./routes/reviews");

const app = express();

// connect to db

mongoose.connect("mongodb://localhost:27017/surf-shop");

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'conection error: '))
db.once('open', () => {  
  console.log('we are conected!')
})
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Configure passport and sessions

app.use(
  session({
    secret: "hang tight",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize())
app.use(passport.session())

//CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Mount routes
app.use("/", indexRouter);
app.use("/posts", posts);
app.use("/posts/:id/reviews", reviews);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
