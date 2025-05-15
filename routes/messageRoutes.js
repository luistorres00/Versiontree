const express = require("express");
const router = express.Router();
const {
  addMessage,
  getMessages,
  deleteMessages,
  updateMessageState,
} = require("../controller/messagesController");

// Route para armazenar mensagens
router.post("/addMessage", (req, res) => {
  console.log("Inserting message");
  addMessage(req, res);
});

// Route para ir buscar mensagens
router.get("/getMessages", (req, res) => {
  console.log("Fetching messages");
  getMessages(req, res);
});

// Route para dar update como foi lida
router.put("/setSeen/:id", (req, res) => {
  console.log("Message was seen!");
  updateMessageState(req, res);
});

// Route para ir buscar mensagens
router.delete("/deleteMessages", (req, res) => {
  console.log("Deleting all messages...");
  deleteMessages(req, res);
});

module.exports = router;
