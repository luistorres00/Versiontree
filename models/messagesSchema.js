const mongoose = require("mongoose");

// Definir modelo Mongoose para os dados
const messagesSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  name: {
    type: String,
  },
  userID: {
    type: String,
  },
  time: {
    type: String,
  },
  date: {
    type: String,
  },
  recipient: {
    type: String,
  },
});

const Messages = mongoose.model("Messages", messagesSchema);

module.exports = Messages;
