const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const path = require("path");
const socketIO = require("socket.io");


//variaveis de config e rotas
const authRoutes = require("../Versiontree_new/routes/authRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const messageRoutes = require("./routes/messageRoutes");
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
  key: fs.readFileSync(path.resolve(pwaPath, "10.12.84.130-key.pem")),
  cert: fs.readFileSync(path.resolve(pwaPath, "10.12.84.130.pem")),
};
const port = process.env.PORT || 16082;
const httpPort = process.env.PORT || 443;

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

    // Criar server http
    const httpServer = require("http").createServer(app);

    // Criar servidor https
    const httpsServer = https.createServer(options, app);

    // Attach Socket.IO to HTTPS server
    const io = socketIO(httpsServer, {
      cors: {
        origin: "*", // Adjust origins as needed
      },
    });

    // Handle socket connections
    io.on("connection", (socket) => {
      console.log("A client connected:", socket.id);

      socket.emit("message", buildMsg("System", "Bem vindo ao chat WFR!"));

      // Listening for a message event
      socket.on("message", ({ name, text }) => {
        io.emit("message", buildMsg(name, text));
      });

      socket.on("activity", (name) => {
        socket.broadcast.emit("activity", name);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    // Iniciar servidores
    httpServer.listen(port, () => {
      console.log(`HTTP server running at http://localhost:${port}`);
    });

    httpsServer.listen(httpPort, () => {
      console.log(`HTTPS server running at https://localhost:${httpPort}`);
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

function buildMsg(name, text) {
  return {
    name,
    text,
    time: new Intl.DateTimeFormat("default", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(new Date()),
    date: new Intl.DateTimeFormat("default", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date()),
  };
}

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

// Settings
app.use("/settings", settingsRoutes);

// Chat
app.use("/messages", messageRoutes);

//use routing
app.use(express.json());
app.use(routes);
