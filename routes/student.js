const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const generateStrongPassword = require("../services/generatePassword");
const initiateMail = require('../services/mailService');
const {studentSchema} = require('../validators/schema')

router.post("/addStudent", async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    
    const { error } = studentSchema.validate(data);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const password = generateStrongPassword(10);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      ...data,
      password: hashedPassword,
    });
    await newUser.save();
    await initiateMail({...data, password});

    return res.status(200).json({ msg: "Signed-in Successfully" });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ msg: "User already exists" });
    }
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
