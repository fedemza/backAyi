const express = require("express");
const {
  getAllSales,
  createSale,
  updateSale,
  deleteSale,
  getSale,
} = require("../controllers/ventasController");

const router = express.Router();

router.get("/", getAllSales);

router.get("/:id", getSale);

router.post("/", createSale);

router.put("/:id", updateSale);

router.delete("/:id", deleteSale);

module.exports = router;
