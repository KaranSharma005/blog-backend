const express = require("express");
const router = express.Router()
const auth = require("./auth");

router.use('/api',auth);

module.exports = router;