const Messages = require("../models/messagesSchema");

const addMessage = async (req, res) => {
  try {
    const { text, name, time, userID, date, recipient } = req.body;
    console.log("Body:", req.body);
    const newMessage = new Messages({
      text,
      name,
      time,
      userID,
      date,
      recipient,
      seen: false,
    });
    await newMessage.save();
    console.log("Nova mensagem guardada: ", newMessage);
    res.status(201).json({ message: "Mensagem adicionada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao adicionar mensagem" });
  }
};

const getMessages = async (req, res) => {
  try {
    const allMessages = await Messages.find().sort({ date: 1 });
    res.json(allMessages);
  } catch (error) {
    console.log("Erro encontrado", error);
    res.status(500).json({ error: "Erro ao ir buscar mensagens" });
  }
};

const deleteMessages = async (req, res) => {
  try {
    const deletedMessages = await Messages.deleteMany({});
    res.json(deletedMessages);
  } catch (error) {
    console.log("Erro encontrado", error);
    res.status(500).json({ error: "Erro ao apagar mensagens" });
  }
};

// Atualiza o estado da mensagem quando vista
const updateMessageState = async (req, res) => {
  try {
    const fetchedMessage = req.body;
    console.log("Message id Controller:",fetchedMessage);
    const updatedMessage = await Messages.findOneAndUpdate(
      fetchedMessage,
      { $set: { seen: true } },
      { new: true }
    );
  } catch (error) {
    console.log("Erro encontrado a alterar mensagem: ", error);
    res.status(500).json({ error: "Erro ao atualizar mensagem" });
  }
};

module.exports = {
  addMessage,
  getMessages,
  deleteMessages,
  updateMessageState,
};
