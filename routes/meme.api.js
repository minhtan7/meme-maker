var express = require("express");
var router = express.Router();
const upload = require("../middleware/upload.helper").upload;
const photosMiddleware = require("../middleware/photo.helper");
const memeController = require("../controllers/meme.controller");

/**
 * @route POST api/memes
 * @description - Accept an upload with this request
 * - save file to disk
 * - return success if everything worked
 * @access: Public
 * the key "image" is set when sending the request in postman
 */

router.post(
  "/",
  upload.single("image"),
  photosMiddleware.resize,
  memeController.createMeme,
  function (req, res, next) {
    console.log("req.file is", req.file);
    res.json({ status: "ok", text: "file is blur" });
  }
);

/**
 * @route GET api/memes
 * @description Get all memes
 * @access Public
 */

router.get("/", memeController.getMemes);

/**
 * @route GET api/memes/images
 * @description Get list of original images
 * @access Public
 */
router.get("/images", memeController.getOriginalImage);

module.exports = router;
