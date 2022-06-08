const validator = require("validator");
const bcrypt = require("bcrypt");
const Usuarios = require("../models/usuarioModel");

const createUser = async (req, res) => {
  const { nombre, email, contraseña } = req.body;

  try {
    if (!nombre || !email || !contraseña) {
      res
        .status(400)
        .json({ msg: "El nombre, email o la contraseña no existe" });
      return;
    }

    if (
      !validator.isAlpha(nombre, ["en-US"], { ignore: " " }) ||
      !validator.isEmail(email)
    ) {
      res.status(400).json({ msg: "El nombre o el email son inválidos" });
      return;
    }

    if (await Usuarios.findOne({ email })) {
      res.status(400).json({ msg: "El email ya existe" });
      return;
    }

    bcrypt.hash(contraseña + "", 10, function (err, hash) {
      if (err) {
        res.status(500).json({ msg: "Error al encriptar la contraseña", err });
        return;
      }
      const usuario = new Usuarios({
        nombre,
        email,
        contraseña: hash,
      });
      usuario.save();
      res.json({ msg: "Usuario creado con éxito" });
    });
  } catch (err) {
    res.status(400).json({ msg: "No se pudo guardar el usuario", error: err });
    return;
  }
};

module.exports = {
  createUser,
};
