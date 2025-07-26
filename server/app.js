const express = require("express");
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

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.set("strictQuery", false);
const mongoDB = process.env.DB_URL;

mongoose.connect(mongoDB).then(() => {
  app.set("trust proxy", 1);
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: mongoDB }),
      cookie: {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: null,
      },
    }),
  );

  app.use("/api/items", itemRouter);
  app.use("/api/user", userRouter);

}).catch((err) => {
  console.error(err);
});

module.exports = app;
