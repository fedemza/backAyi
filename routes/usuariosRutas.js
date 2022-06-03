const express = require("express");
const {
  getAllUsers,
  createUser,
  updateUser,
  deactivateUser,
} = require("../controllers/usuariosController");

const router = express.Router();

router.get("/", getAllUsers);

router.post("/", createUser);

router.put("/:id", updateUser);

router.delete("/:id", deactivateUser);

module.exports = router;
