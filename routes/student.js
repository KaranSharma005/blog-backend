const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const generateStrongPassword = require("../services/generatePassword");

router.post("/addStudent", async (req, res) => {
    try{
        const data = req.body;
        
    }
    catch(err){
        console.log(err);
    }
})

module.exports = router;