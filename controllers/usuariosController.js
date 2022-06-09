const validator = require("validator");
const bcrypt = require("bcrypt");
var ObjectId = require("mongodb").ObjectId;
const Usuarios = require("../models/usuarioModel");

const getAllUsers = async (req, res) => {
  try {
    const users = await Usuarios.find();
    res.status(200).json(users);
    return;
  } catch (err) {
    res.status(500).json({ msg: "Hubo un error en la consulta", error: err });
    return;
  }
};

const getAllActiveUsers = async (req, res) => {
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
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json({ msg: "El id no es válido" });
      return;
    }

    if (!(await Usuarios.findById(req.params.id))) {
      res.status(400).json({ msg: "El usuario no existe" });
      return;
    }

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
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json({ msg: "El id no es válido" });
      return;
    }

    if (!(await Usuarios.findById(req.params.id))) {
      res.status(400).json({ msg: "El usuario no existe" });
      return;
    }

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

const activateUser = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json({ msg: "El id no es válido" });
      return;
    }

    if (!(await Usuarios.findById(req.params.id))) {
      res.status(400).json({ msg: "El usuario no existe" });
      return;
    }

    await Usuarios.findByIdAndUpdate(req.params.id, {
      $set: {
        activo: true,
      },
    });
    res.json({ msg: "Usuario dado de alta con éxito" });
  } catch (err) {
    res.status(400).json({ msg: "No se pudo dar de alta el usuario" });
    return;
  }
};

const deleteUser = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json({ msg: "El id no es válido" });
      return;
    }

    if (!(await Usuarios.findById(req.params.id))) {
      res.status(400).json({ msg: "El usuario no existe" });
      return;
    }
    await Usuarios.findByIdAndDelete(req.params.id);
    res.json({ msg: "Usuario eliminado con éxito" });
    return;
  } catch (err) {
    res.status(400).json({ msg: "No se pudo eliminar el usuario" });
    return;
  }
};

module.exports = {
  getAllUsers,
  getAllActiveUsers,
  updateUser,
  deactivateUser,
  activateUser,
  deleteUser,
};
