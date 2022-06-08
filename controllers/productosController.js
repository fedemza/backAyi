const Productos = require("../models/productoModel");
const validator = require("validator");

const getAllProducts = async (req, res) => {
  try {
    const productos = await Productos.find();
    res.json(productos);
  } catch (err) {
    console.log({ msg: "Hubo un error en la consulta", error: err });
    res.status(400).json({ msg: "No se pudo obtener los productos" });
  }
};

const createProduct = async (req, res) => {
  const { nombre, precio, descripcion, imagen } = req.body;
  try {
    if (!nombre || !precio) {
      res.status(400).json({ msg: "El nombre o el precio no existe" });
      return;
    }
    if (!validator.isAlpha(nombre) || !validator.isNumeric(precio)) {
      res.status(400).json({ msg: "El nombre o el precio son inválidos" });
      return;
    }

    const producto = new Productos({
      nombre,
      precio,
      descripcion,
      imagen,
    });
    await producto.save();
    res.json({ msg: "Producto creado con éxito" });
  } catch (err) {
    res.status(400).json({ msg: "No se pudo guardar el producto", error: err });
  }
};

const updateProduct = async (req, res) => {
  const { nombre, precio, descripcion, imagen } = req.body;

  try {
    if (!validator.isAlpha(nombre) || !validator.isNumeric(precio)) {
      res.status(400).json({ msg: "El nombre o el precio son inválidos" });
      return;
    }
    const producto = await Productos.find({ _id: req.params.id });
    console.log(producto);
    await Productos.findByIdAndUpdate(req.params.id, {
      $set: {
        nombre,
        precio,
        descripcion,
        imagen,
      },
    });
    res.json({ msg: "Producto actualizado con éxito" });
  } catch (err) {
    res.status(400).json({ msg: "No se pudo actualizar el producto" });
    return;
  }
};

const deleteProduct = async (req, res) => {
  try {
    const producto = await Productos.findByIdAndDelete(req.params.id);
    if (!producto) {
      res.status(400).json({ msg: "El producto no existe" });
      return;
    }
    res.json({ msg: "Producto eliminado con éxito" });
  } catch (err) {
    res.status(400).json({ msg: "No se pudo eliminar el producto" });
    return;
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
