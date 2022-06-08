const express = require("express");
const { createUser } = require("../controllers/authController");

const router = express.Router();

router.post("/signin", createUser);
router.post("/login");
router.post("/logout");

module.exports = router;
