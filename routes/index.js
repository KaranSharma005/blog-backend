const express = require("express");
const router = express.Router();
const auth = require("./auth");
const student = require("./student")

router.use('/api',auth);
router.use('/student',student);

module.exports = router;