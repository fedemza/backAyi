const express = require("express");
const { createUser, login, logout } = require("../controllers/authController");

const router = express.Router();

router.post("/signin", createUser);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
