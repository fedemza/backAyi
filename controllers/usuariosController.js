const validator = require("validator");
const bcrypt = require("bcrypt");
const Usuarios = require("../models/usuarioModel");

const getAllUsers = async (req, res) => {
  try {
    const usuarios = await Usuarios.find({ activo: true });
    res.json(usuarios);
  } catch (err) {
    console.log({ msg: "Hubo un error en la consulta", error: err });
  }
};

const updateUser = async (req, res) => {
  const { nombre, email, contraseña } = req.body;

  try {
    if (
      (nombre && !validator.isAlpha(nombre, ["en-US"], { ignore: " " })) ||
      (email && !validator.isEmail(email))
    ) {
      res.status(400).json({ msg: "El nombre o el email son inválidos" });
      return;
    }

    bcrypt.hash(contraseña + "", 10, async function (err, hash) {
      if (err) {
        res.status(500).json({ msg: "Error al encriptar la contraseña", err });
        return;
      }

      await Usuarios.findByIdAndUpdate(req.params.id, {
        nombre: nombre,
        email: email,
        contraseña: hash,
      });

      res.json({ msg: "Usuario actualizado con éxito" });
    });
  } catch (err) {
    res.status(400).json({ msg: "No se pudo actualizar el usuario" });
    return;
  }
};

const deactivateUser = async (req, res) => {
  try {
    // const usuario = await Usuarios.find({ _id: req.params.id });
    // console.log(usuario);
    await Usuarios.findByIdAndUpdate(req.params.id, {
      $set: {
        activo: false,
      },
    });
    res.json({ msg: "Usuario dado de baja con éxito" });
  } catch (err) {
    res.status(400).json({ msg: "No se pudo dar de baja el usuario" });
    return;
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  deactivateUser,
};
