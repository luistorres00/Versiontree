const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const { readFile } = require("./utilities/fileReader");

// Variáveis de rotas
const authRoutes = require("../Versiontree/routes/authRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const messageRoutes = require("./routes/messageRoutes");
const userStatusRoutes = require("./routes/isOnlineRoutes");
const routes = require("./routes/routing");
const {
  addController,
  getController,
  putController,
} = require("./controller/indexcont");

// Init express, port & http
const app = express();
const pwaPath = path.join(__dirname, "public", "pwa"); // Caminho ajustado

// Read File Functions
const SERVER_IP = readFile("./ip.txt").trim();
app.get("/api/getIp", (req, res) => {
  const ipUntouched = readFile("./ip.txt");
  const ip = ipUntouched.trim();
  console.log("IP HERE:", ip); //
  res.json({ ip });
});

// Middleware para análise de dados JSON
app.use(bodyParser.json());

// Configurar CORS
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

    // Criar servidor HTTP (sem HTTPS)
    const server = http.createServer(app);

    // Attach Socket.IO ao servidor HTTP
    const io = socketIO(server, {
      cors: {
        origin: "*", // Ajuste conforme necessário
      },
    });

    // Handle socket connections
    io.on("connection", (socket) => {
      const { username, userID } = socket.handshake.auth;
      const user = { username: username, userID: userID, userState: true };
      setUserState(user);
      setTimeout(() => {
        socket.broadcast.emit("list-refresh");
      }, 100);

      socket.on("message", ({ name, text, userID, recipient }) => {
        io.emit("message", buildMsg(name, text, userID, recipient));
      });

      socket.on("activity", (name) => {
        socket.broadcast.emit("activity", name);
      });

      socket.on("chat-focused", (data) => {
        socket.emit("chat-focused", sendSeenResponse(data));
      });

      socket.on("notification-set", (data) => {
        console.log("Notification backend", data);
        socket.broadcast.emit("notification-set", sendNotif(data));
      });

      socket.on("disconnect", () => {
        user.userState = false;
        setUserState(user);
        socket.broadcast.emit("list-refresh");
        console.log("Client disconnected:", user.userID);
      });
    });

    // Iniciar servidor
    const port = process.env.PORT || 16082;
    server.listen(port, () => {
      console.log(`Server running at http://${SERVER_IP}:${port}`);
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

function buildMsg(name, text, userID, recipient) {
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
    userID,
    recipient,
  };
}

function sendSeenResponse(data) {
  return {
    senderID: data.senderID,
    userID: data.userID,
  };
}

function sendNotif(data) {
  return {
    senderID: data.senderID,
    recipient: data.recipient,
  };
}

function setUserState(user) {
  const url = `http://localhost:16082/userStatus/setStatus/${user.userID}`;

  console.log("User:\n", user);
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Update response:", data);
    })
    .catch((error) => {
      console.log("Something went wrong updating status:", error);
    });
}

// Middleware para análise de dados JSON
app.use(bodyParser.json());

// Configurar rotas
app.post("/addData", addController.addData);
app.get("/getData", getController.getData);
app.put("/updateData/:id", putController.putData);

// Static files
app.use(express.static("public"));

// Rotas
app.use("/auth", authRoutes);
app.use("/settings", settingsRoutes);
app.use("/messages", messageRoutes);
app.use("/userStatus", userStatusRoutes);
app.use(express.json());
app.use(routes);
