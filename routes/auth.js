const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ADMIN_MAIL = process.env.ADMIN_EMAIL;
const SECRET_KEY = process.env.SECRET_KEY;
const { signUpSchema, signInSchema } = require("../validators/schema");

router.post("/signup", async (req, res) => {
  try {
    const body = req.body;
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const { error } = signUpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const email = body.email;
    let admin = false;
    if (email == ADMIN_MAIL) {
      admin = true;
    }

    const newUser = new userModel({
      ...body,
      password: hashedPassword,
      isAdmin: admin,
    });
    await newUser.save();
    return res.status(200).json({ msg: "Signed-in Successfully" });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ msg: "Student already exists" });
    }
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const { error } = signInSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (!email || !password) {
      return res
        .send(400)
        .json({ success: false, message: "Incomplete fields" });
    }
    const user = await userModel.findOne({ email: email }); //extract user details from mongo
    const isMatch = await bcrypt.compare(password, user.password);
    let checkAdmin = false;
    console.log(user);

    if (user.email == ADMIN_MAIL && isMatch) {
      checkAdmin = true;
    }

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, msg: "Password do not match" });
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

    const sanitizedUser = {
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    return res.status(200).json({
      success: true,
      msg: "Logged in successfully",
      isAdmin: checkAdmin,
      user: sanitizedUser,
    });
  } catch (err) {
    return res.status(400).json({ success: false, msg: "Error in userlogin" });
  }
});

router.get("/auth", async (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      loggedIn: false,
      message: "Unauthorized user: No token provided",
    });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(403).json({
        loggedIn: false,
        message: "Forbidden: Invalid token",
      });
    }

    // ✅ Token is valid
    return res.status(200).json({
      loggedIn: true,
      user,
    });
  });
});

module.exports = router;
