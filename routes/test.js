const express = require("express");
const router = express.Router();
const { testValidator } = require("../validators/schema");
const { Test } = require("../models/testSchema");
const dayjs = require("dayjs");

router.post("/addTest", async (req, res) => {
  try {
    let data = req?.body;
    data = { ...data, date: dayjs(data.date).format("YYYY/MM/DD") };
    const { error } = testValidator.validate(data);
    if (error) {
      console.log(error.details[0].message);

      return res.status(400).json({ message: error.details[0].message });
    }
    const newTest = new Test(data);
    const testDocument = await newTest.save();
    console.log(testDocument._id);

    return res.status(200).json({ msg: "Test generated successfully", _id : testDocument?._id });
  } catch (err) {
    return res.status(400).json({ msg: "Error in adding test" });
  }
});

router.get("/getAll", async (req, res) => {
  try { 
    const data = await Test.find({delete : false}).select("-questions -active");
    return res.status(200).json({msg : "TEST fetching complete", data});
  } catch (err) {
    return res.status(400).json({ msg: "Error in getching test data" });
  }
});

router.delete("/delete", async (req, res) => {
  try{
    const id = req.query?.id;
    console.log(id);
    
    await Test.findByIdAndUpdate(id,{ delete : true});
    return res.status(200).json({msg : "Deleted successfully"});
  }
  catch(err){
    console.log(err);
    return res.status(200).json({msg : "error in deleting test"});
  }
})
module.exports = router;
