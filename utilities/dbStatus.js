const mongoose = require("mongoose");

function isMongoConnected() {
  const state = mongoose.connection.readyState;
  console.log("A dar fetch do state...");
  // readyState:
  // 0 = disconnected
  // 1 = connected
  // 2 = connecting
  // 3 = disconnecting
  return state === 1; // retorna true se conectado
}

module.exports = { isMongoConnected };
