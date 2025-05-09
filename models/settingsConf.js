const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  timeRestriction: {
    type: Boolean,
    default: true,
  },
  timeRestrictionValue: {
    type: Number,
    default: 20,
  },
});

// Define o modelo Settings
const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;
