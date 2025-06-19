const express = require("express");
const router = express.Router();
const auth = require("./auth");
const student = require("./student");
const test = require("./test");

router.use('/api',auth);
router.use('/student',student);
router.use('/test',test)

module.exports = router;