const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuarios = require("../models/usuarioModel");

let jwToken = null;
let blackList = [];

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
      res.json({ msg: "Usuario creado con éxito", id: usuario._id });
    });
  } catch (err) {
    res.status(400).json({ msg: "No se pudo guardar el usuario", error: err });
    return;
  }
};

const login = async (req, res) => {
  const { email, contraseña } = req.body;

  try {
    if (!email || !contraseña) {
      res.status(400).json({ msg: "El email o la contraseña no existe" });
      return;
    }

    const usuario = await Usuarios.findOne({ email });

    if (!usuario || usuario.activo === false) {
      res
        .status(400)
        .json({ msg: "El email no existe o el usuario esta inactivo" });
      return;
    }

    bcrypt.compare(contraseña + "", usuario.contraseña, function (err, result) {
      if (err) {
        res.status(500).json({ msg: "Error al comparar la contraseña", err });
        return;
      }
      if (result) {
        jwToken = jwt.sign(
          {
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.json({
          msg: "Usuario logueado con éxito",
          email: usuario.email,
          token: jwToken,
        });
        return;
        // res.json({ msg: "Usuario logueado con éxito" });
      } else {
        res.status(400).json({ msg: "La contraseña es incorrecta" });

        return;
      }
    });
  } catch (err) {
    res.status(400).json({ msg: "No se pudo loguear el usuario", error: err });
    return;
  }
};

const logout = async (req, res) => {
  blackList.push(jwToken);
  res.json({ msg: "Usuario deslogueado con éxito" });
};

module.exports = {
  createUser,
  login,
  logout,
  blackList,
};
