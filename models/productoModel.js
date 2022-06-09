const mongoose = require("mongoose");

const productosSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    precio: {
      type: Number,
      required: true,
    },
    ordenesTotales: {
      type: Number,
      default: 0,
    },
    descripcion: String,
    imagen: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Productos", productosSchema);
