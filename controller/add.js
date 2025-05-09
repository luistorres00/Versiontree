const Dados = require("../models/schema");

exports.addData = async (req, res) => {
  try {
    const {
      corrida,
      camera,
      indice,
      curva,
      hora,
      video,
      report,
      nfa,
      priority,
      obs,
      userID,
    } = req.body;

    // Criar um novo objeto de dados com os dados recebidos
    const novoDado = new Dados({
      corrida,
      camera,
      indice,
      curva,
      hora,
      video,
      report,
      nfa,
      priority,
      obs,
      userID,
    });
    console.log(novoDado);
    // Salvar o novo dado no banco de dados
    await novoDado.save();

    res.json({ message: "Dados adicionados com sucesso." });
  } catch (error) {
    console.error("Erro ao adicionar dados:", error);
    res.status(500).json({ error: "Erro ao adicionar dados." });
  }
};
