var express = require("express");
var router = express.Router();

const memeAPI = require("./meme.api");
router.use("/memes", memeAPI);

module.exports = router;
