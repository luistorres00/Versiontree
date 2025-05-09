const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/models");
const { generateToken } = require("../utilities/jwtUtils");
const { isMongoConnected } = require("../utilities/dbStatus");

const registerUser = async (req, res) => {
  try {
    const { username, password, usertype } = req.body;

    // Verificar se o nome de usuário já existe no banco de dados
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, usertype, password: hashedPassword });
    await newUser.save();

    // Gerar o token JWT e enviar como parte da resposta
    generateToken({ username: newUser.username }, (token) => {
      res
        .status(201)
        .json({ message: "User registered successfully", usertype, token });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

async function editUser(req, res) {
  try {
    const { id } = req.params;
    const { username, password } = req.body;
    // Verifica se o id é válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    // Procura o usuário pelo id
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Atualiza os dados do usuário
    user.username = username;
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    // Verifica se o id é válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    // Procura e exclui o usuário pelo id
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const loginUser = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      console.log("Not connected!");
      return res
        .status(503)
        .json({ message: "Database connection is not active" });
    }
    const { username, password } = req.body;

    // Procura o usuário pelo nome de usuário
    const user = await User.findOne({ username });

    // Se o usuário não for encontrado
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verifica se a senha fornecida corresponde à senha armazenada no banco de dados
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Se as credenciais estiverem corretas, gera um token de autenticação
    generateToken({ user }, (token) => {
      console.log("Login válido");
      console.log(user._id, user.usertype, user.username);
      res.status(200).json({
        message: "User logged successfully",
        userID: user._id,
        username: user.username,
        usertype: user.usertype,
        token,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logoutUser = (req, res) => {
  //limpar token lado clt

  res.status(200).json({ message: "User logged out successfully" });
};

const fetchById = async (userID) => {
  try {
    const user = await User.findById(userID); // ensure User is your Mongoose model
    return user;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
};

module.exports = {
  registerUser,
  editUser,
  deleteUser,
  loginUser,
  logoutUser,
  fetchById,
};
