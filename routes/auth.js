const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

router.post("/signup", async (req, res) => {
  const body = req.body;
  console.log(body);
  const hashedPassword = await bcrypt.hash(body.password, 10);
  try {
    const newUser = new userModel({ ...body, password: hashedPassword });
    await newUser.save();
    return res.status(200).json({ msg: "Signed-in Successfully" });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ msg: "User already exists" });
    }
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      return res
        .send(400)
        .json({ success: false, message: "Incomplete fields" });
    }
    const user = await userModel.findOne({ email: email }); //extract user details from mongo
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    
    if (!isMatch) {
      return res.status(401).json({success: false, msg: "Password do not match" });
    }
    const token = jwt.sign(
      {
        email,
        password,
      },
      SECRET_KEY
    );
    console.log(token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3600,
    });

    return res.status(200).json({success: true, msg: "Logged in successfully" });
  } catch (err) {
    return res.status(400).json({success: false, msg: "Error in userlogin" });
  }
});

module.exports = router;
