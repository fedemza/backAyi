const jwt = require("jsonwebtoken");
let { blackList } = require("../controllers/authController");

let verificarToken = (req, res, next) => {
  let token = req.get("Authorization");
  if (blackList.includes(token)) {
    res.status(401).json({ msg: "El token ha expirado" });
    return;
  }

  jwt.verify(token, "secret", (err, decoded) => {
    if (err) {
      return res.status(401).json({
        err,
      });
    }
    req.usuario = decoded.usuario;
    next();
  });
};

module.exports = verificarToken;
