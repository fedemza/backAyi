const Ventas = require("../models/ventaModel");
const Productos = require("../models/productoModel");

const getAllSales = async (req, res) => {
  try {
    const ventas = await Ventas.find();
    res.json(ventas);
  } catch (err) {
    console.log({ msg: "Hubo un error en la consulta", error: err });
    res.status(400).json({ msg: "No se pudo obtener las ventas" });
  }
};

const getSale = async (req, res) => {
  try {
    const venta = await Ventas.findById(req.params.id);

    const productosId = venta.productosId;

    Productos.find(
      { _id: productosId },
      { nombre: 1, descripcion: 1 },
      (err, productos) => {
        if (err) {
          res.status(400).json({ msg: "No se pudo obtener los productos" });
        } else {
          //productos.push(productos);
          res.json({ venta: venta, productosVenta: productos });
        }
      }
    );
  } catch (err) {
    //console.log({ msg: "Hubo un error en la consulta", error: err });
    res.status(400).json({ msg: "No se pudo obtener la venta", err });
  }
};

const createSale = async (req, res) => {
  const { productosId, formaPago, total } = req.body;

  try {
    if (!productosId || !total) {
      res.status(400).json({ msg: "Los productos o el total no existe" });
      return;
    }
    const productos = [];

    const encontrarProductos = async () => {
      for (let i = 0; i < productosId.length; i++) {
        Productos.findById(productosId[i], (err, producto) => {
          console.log(producto);
          if (err) {
            console.log("No se pudo obtener alguno de los productos");
            productos.push("Error");
            res
              .status(400)
              .json({ msg: "No se pudo obtener alguno de los productos", err });
            return;
          } else {
            productos.push(producto);
          }
        });
      }
    };
    await encontrarProductos();

    if (!productos.includes("Error")) {
      const venta = new Ventas({
        productosId,
        formaPago,
        total,
      });
      await venta.save();

      productosId.forEach(async (producto) => {
        await Productos.findByIdAndUpdate(producto, {
          $inc: {
            ordenesTotales: +1,
          },
        });
      });

      res.json({ msg: "Venta creada con éxito" });
      return;
    }
  } catch (err) {
    res.status(400).json({
      msg: "No se pudo guardar la venta, hubo algun error",
      error: err,
    });
    return;
  }
};

const updateSale = async (req, res) => {
  const { productosId, formaPago, total } = req.body;

  try {
    if (!productosId && !total && !formaPago) {
      res
        .status(400)
        .json({ msg: "Los productos, el total o la forma de pago no existe" });
      return;
    }
    const productos = [];
    if (productosId) {
      const encontrarProductos = async () => {
        for (let i = 0; i < productosId.length; i++) {
          Productos.findById(productosId[i], (err, producto) => {
            if (err) {
              // console.log("No se pudo obtener alguno de los productos");
              productos.push("Error");
              res.status(400).json({
                msg: "No se pudo obtener alguno de los productos",
                err,
              });
              return;
            } else {
              productos.push(producto);
            }
          });
        }
      };
      await encontrarProductos();
    }

    if (!productos.includes("Error")) {
      const venta = await Ventas.find({ _id: req.params.id });

      await Ventas.findByIdAndUpdate(req.params.id, {
        $set: {
          productosId,
          formaPago,
          total,
        },
      });
      res.json({ msg: "Venta actualizada con éxito" });
    }
  } catch (err) {
    res.status(400).json({ msg: "No se pudo actualizar la venta" });
    return;
  }
};

const deleteSale = async (req, res) => {
  try {
    await Ventas.findByIdAndDelete(req.params.id);
    res.json({ msg: "Venta eliminada con éxito" });
  } catch (err) {
    res.status(400).json({ msg: "No se pudo eliminar la venta" });
    return;
  }
};

module.exports = {
  getAllSales,
  getSale,
  createSale,
  updateSale,
  deleteSale,
};
