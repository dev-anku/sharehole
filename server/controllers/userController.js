const bcrypt = require("bcrypt");
const User = require("../models/user.js");

exports.session = async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ user: null });

  try {
    const user = await User.findById(req.session.userId).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ user: null });
  }
};

exports.user_register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.status(404).json({ message: "Username taken" });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hash });
    await user.save();

    req.session.userId = user._id;
    res.json({ _id: user._id, username: user.username });
  } catch (error) {
    console.error("Error registring user: ", error);
    res.status(500).json({ message: "Server error registring user." });
  }
};

exports.user_login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "Invalid username" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(404).json({ message: "Invalid password" });

    req.session.userId = user._id;
    res.json({ success: true });
  } catch (error) {
    console.error("Error logging in user: ", error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.user_logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
};
