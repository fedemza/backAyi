const express = require("express");
const { createUser, login, logout } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
