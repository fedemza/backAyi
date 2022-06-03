const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const rutasProductos = require("./routes/productosRutas");
const rutasUsuarios = require("./routes/usuariosRutas");

app = express();
const port = process.env.PORT || 3000;
const urlDatabase = process.env.URL_DATABASE;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/productos", rutasProductos);
app.use("/usuarios", rutasUsuarios);

mongoose
  .connect(urlDatabase)
  .then(() => console.log("Connected to MongoDB..."));

app.listen(port, () => {
  console.log("Server started on port " + port);
});
