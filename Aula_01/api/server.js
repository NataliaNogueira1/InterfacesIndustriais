const express = require("express");
const cors = require("cors");
const api = express();

//Configurar os middlewares
api.use(express.json());
api.use(cors());

//Rotas
api.get("/", (req, res) => {
  res.send("Hello World!").status(200);
});

//Rodando o servidor
const porta = 8080;
api.listen(porta, () => {
  console.log("Servidor rodando na porta: ${porta}");
});
