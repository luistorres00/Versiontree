const express = require("express");
const router = express.Router();
const {
  addSettings,
  putSettings,
  deleteSettings,
  getSettings,
} = require("../controller/settingsController");

router.post("/insertSettings", (req, res) => {
  console.log("Inserting settings");
  addSettings(req, res);
});

router.put("/updateSettings", (req, res) => {
  console.log("Updating settings");
  putSettings(req, res);
});

router.get("/fetchSettings", (req, res) => {
  console.log("Fetching settings");
  getSettings(req, res);
});

router.delete("/deleteSettings", (req, res) => {
  console.log("Deleting settings");
  deleteSettings(req, res);
});

module.exports = router;
