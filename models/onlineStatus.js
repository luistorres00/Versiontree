const mongoose = require("mongoose");

const isOnlineSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  userID: {
    type: String,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
});

// Define o modelo Settings
const isOnline = mongoose.model("isOnline", isOnlineSchema);

module.exports = isOnline;
