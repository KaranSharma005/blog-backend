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
    const email = data?.email;
    const user = await userModel.findOne({email});
    if(user){
      await userModel.findOneAndUpdate({email}, {$set : { active : true }});
      return res.status(200).json({ msg: "Created Successfully" , _id : user._id});
    }

    const password = generateStrongPassword(10);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      ...data,
      password: hashedPassword,
    });
    await newUser.save();
    
    await initiateMail({...data, password});      //send mail with initial password

    return res.status(200).json({ msg: "Created Successfully" , _id : userData?._id});
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ msg: "User already exists" });
    }
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
});

router.get('/getAll', async(req,res) => {
  try{
    const users = await userModel.find({isAdmin : false, active : true}).select("name email rollNo");
    return res.status(200).json({data : users});
  }
  catch(err){
    return res.status(400).json({ error: "Server error", msg: err.message })
  }
})

router.delete("/deleteStudent", async (req, res) => {
  try{
    const id = req.query?.id;
    const user = await userModel.findByIdAndUpdate(id,{active : false}, {new : true});
    console.log(user);
    return res.status(200).json({msg : "Deleted successfully"});
  }
  catch(err){
    return res.status(400).json({msg : "Error in deleting student"});
  }
})

module.exports = router;
