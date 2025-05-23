const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const path = require("path");

//variaveis de config e rotas
const authRoutes = require("../versiontree/routes/authRoutes");
const routes = require("./routes/routing");
const {
  addController,
  getController,
  putController,
} = require("./controller/indexcont");

//init express, port & http
const app = express();
const pwaPath = path.join(__dirname, "public", "pwa"); // Caminho ajustado

const keyPath = path.join(pwaPath, "localhost+2-key.pem");
const certPath = path.join(pwaPath, "localhost+2.pem");

// Verificação de Existência de Arquivos
if (!fs.existsSync(keyPath)) {
  console.error(`Arquivo de chave SSL não encontrado: ${keyPath}`);
  process.exit(1);
}

if (!fs.existsSync(certPath)) {
  console.error(`Arquivo de certificado SSL não encontrado: ${certPath}`);
  process.exit(1);
}

const options = {
  key: fs.readFileSync(path.resolve(pwaPath, "localhost+2-key.pem")),
  cert: fs.readFileSync(path.resolve(pwaPath, "localhost+2.pem")),
};
const port = process.env.PORT || 16082;

//iniciar cors
app.use(
  cors({
    origin: "*",
  })
);

// Conectar ao MongoDB
mongoose
  .connect("mongodb://localhost:27017/local")
  .then(() => {
    console.log("MongoDB is connected");
    // Start the server only after DB connection
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
    https.createServer(options, app).listen(443, () => {
      console.log(`Servidor HTTPS rodando em https://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Middleware para análise de dados JSON
app.use(bodyParser.json());

// Configurar rotas
app.post("/addData", addController.addData);
app.get("/getData", getController.getData);
app.put("/updateData/:id", putController.putData);

//public access
app.use(express.static("public"));

//login
app.use("/auth", authRoutes);

//use routing
app.use(express.json());
app.use(routes);
