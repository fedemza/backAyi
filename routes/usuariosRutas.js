const express = require("express");
const {
  getAllUsers,
  updateUser,
  deactivateUser,
} = require("../controllers/usuariosController");

const router = express.Router();

router.get("/", getAllUsers);

router.put("/:id", updateUser);

router.delete("/:id", deactivateUser);

module.exports = router;
