const express = require("express");
const {
  getAllActiveUsers,
  updateUser,
  deactivateUser,
  activateUser,
  deleteUser,
  getAllUsers,
} = require("../controllers/usuariosController");

const router = express.Router();

router.get("/all", getAllUsers);

router.get("/active", getAllActiveUsers);

router.put("/update/:id", updateUser);

router.put("/deactivate/:id", deactivateUser);

router.put("/activate/:id", activateUser);

router.delete("/:id", deleteUser);

module.exports = router;
