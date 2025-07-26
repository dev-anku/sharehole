const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");

exports.session = asyncHandler(async (req, res, next) => {
  if (!req.session.userId) return res.status(401).json({ user: null });
  const user = await User.findById(req.session.userId).select("-password");
  if (!user) {
    req.session.destory(() => {});
    return res.status(401).json({ user: null });
  }
  res.json(user);
});

exports.user_register = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.status(404).json({ message: "Username taken" });

  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hash });
  await user.save();

  req.session.userId = user._id;
  res.json({ _id: user._id, username: user.username });
});

exports.user_login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "Invalid username" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(404).json({ message: "Invalid password" });

  req.session.userId = user._id;
  res.json({ success: true });
});

exports.user_logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.json({ success: true });
  });
};
