const multer = require("multer");

/**
 * cb = call back (or return)
 * cb(...,...) mean
 * - the first spot is for error => if error is null
 * - the file name will be like this:...(second spot)
 */
const storage = multer.diskStorage({
  destination: "public/images",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

module.exports = {
  upload: multer({
    storage,
  }),
};
