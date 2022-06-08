const mongoose = require("mongoose");

const ventasSchema = new mongoose.Schema(
  {
    productosId: {
      type: Array,
      required: true,
    },
    formaPago: {
      type: String,
      default: "No especificada",
    },
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ventas", ventasSchema);
