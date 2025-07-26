const express = require("express");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const itemRouter = require("./routes/items.js");
const userRouter = require("./routes/users.js");

const app = express();

app.use(
  cors({
    origin: "https://sharehole.onrender.com",
    credentials: true,
  }),
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.set("trust proxy", 1);

mongoose.set("strictQuery", false);
const mongoDB = process.env.DB_URL;

mongoose.connect(mongoDB).catch((err) => {
  console.error(err);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoDB,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60,
      autoRemove: "interval",
      autoRemoveInterval: 10,
    }),
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    },
  }),
);

app.use("/api/items", itemRouter);
app.use("/api/user", userRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;
