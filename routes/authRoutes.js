const express = require("express");
const router = express.Router();
const {
  registerUser,
  editUser,
  deleteUser,
  loginUser,
  logoutUser,
  fetchById,
  fetchAllUsers,
} = require("../controller/authController");
const authenticateToken = require("../middleware/authenticateToken");

router.post("/register", (req, res) => {
  console.log("Received POST request to /register");
  registerUser(req, res);
});

router.put("/edit/:id", (req, res) => {
  console.log("Received PUT request to /edit/:id");
  editUser(req, res);
});

router.delete("/delete/:id", (req, res) => {
  console.log("Received DELETE request to /delete/:id");
  deleteUser(req, res);
});

router.get("/fetchAllUsers", async (req, res) => {
  try {
    const userList = await fetchAllUsers();
    if (userList) {
      res.json(userList);
    } else {
      res.status(404).json({ message: "Usuários não encontrados" });
    }
  } catch (error) {
    res.status(500).json({ message: "Usuários não encontrados: Erro interno" });
  }
});
// Rota para ir buscar o user por ID
router.get("/fetchUser/:id", async (req, res) => {
  const userID = req.params.id;
  try {
    //console.log("Received request to /fetchUser");
    const user = await fetchById(userID);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro interno", error });
  }
});

// Rota protegida
router.get("/protected", authenticateToken, (req, res) => {
  console.log("Received GET request to /protected");
  // Se o token for válido, o usuário está autenticado e pode acessar esta rota
  res.json({ message: "Authorized", user: req.user });
});

router.post("/login", (req, res) => {
  console.log("Received POST request to /login");
  loginUser(req, res);
});

// Rota para fazer logout
router.post("/logout", (req, res) => {
  console.log("Received POST request to /logout");
  logoutUser(req, res);
});

router.all("*", (req, res) => {
  console.log(`Unhandled request: ${req.method} ${req.url}`);
  res.status(404).json({ message: "Route not found" });
});

module.exports = router;
