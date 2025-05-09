const Settings = require("../models/settingsConf");

const addSettings = async (req, res) => {
  try {
    const { timeRestriction, timeRestrictionValue } = req.body;
    const newSettings = new Settings({ timeRestriction, timeRestrictionValue });
    await newSettings.save();
    res.status(201).json({ message: "Configuração adicionada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao adicionar configuração" });
  }
};

const putSettings = async (req, res) => {
  const update = req.body;
  try {
    const updatedSettings = await Settings.findByIdAndUpdate(
      req.body._id,
      update,
      {
        new: true,
      }
    );

    if (!updatedSettings) {
      return res.status(404).json({ message: "Data not found" });
    }
    // Responde com os dados atualizados
    res.status(200).json(updatedSettings);
  } catch (error) {
    res.status(500).json({ error: "Erro ao dar update das configurações" });
  }
};

const deleteSettings = async (req, res) => {
  try {
    const deletingLine = Settings.findByIdAndDelete(req.body.id);
  } catch (error) {
    res.status(500).json({ error: "Erro ao apagar as configurações" });
  }
};

const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter dados das configurações" });
  }
};

module.exports = {
  addSettings,
  putSettings,
  deleteSettings,
  getSettings,
};
