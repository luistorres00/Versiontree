const Messages = require("../models/messagesSchema");

const addMessage = async (req, res) => {
  try {
    const { text, name, time, userID, date } = req.body;
    console.log("Body:", req.body);
    const newMessage = new Messages({ text, name, time, userID, date });
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

module.exports = {
  addMessage,
  getMessages,
};
