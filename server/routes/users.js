const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController.js");

router.get("/", userController.session);
router.post("/register", userController.user_register);
router.post("/login", userController.user_login);
router.post("/logout", userController.user_logout);

module.exports = router;
