const express = require("express");
const router = express.Router();

const{
    setStatus,
    getOnlineUsers,
} = require("../controller/isOnlineController");

router.post("/setStatus/:id", (req,res)=>{
    //setStatus para online ou offline
    setStatus(req,res);
})

router.get("/getOnlineUsers", (req,res)=>{
    getOnlineUsers(req,res);
})

module.exports = router;