const isOnline = require("../models/onlineStatus");


const getOnlineUsers = async (req, res) => {
  try {
    const allOnlineUsers = await isOnline.find();
    res.json(allOnlineUsers);
  } catch (error) {
    console.log("Erro encontrado", error);
    res.status(500).json({ error: "Erro ao ir buscar usuários online" });
  }
};



// Inserir uma entrada na base de dados, caso não exista
const setStatus = async (req,res) =>{
  
    try{
        const userID = req.body.userID;
        const username = req.body.username;
        const targetState = req.body.userState;
        console.log("userid: ",userID);
        console.log("username: ",username)
        console.log("targetState: ",targetState);
        const updatedUserState = await isOnline.findOneAndUpdate(
            {userID : userID},
            {userID: userID, username: username, isOnline: targetState},
            {upsert : true},
        );
        console.log(updatedUserState);
    }catch(error){
        res.status(500).json({error: "Error updating user status"});
    }
    
}

module.exports = {
    setStatus,
    getOnlineUsers,
};