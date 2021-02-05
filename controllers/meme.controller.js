const fs = require("fs");
const photohelpers = require("../middleware/photo.helper");

const createMeme = async (req, res, next) => {
  try {
    // Read data from json file
    const dataRaw = fs.readFileSync("memes.json");
    const memes = JSON.parse(dataRaw).memes;
    const meme = {};
    const texts = req.body.texts || [];
    console.log(texts);
    const textArr = [].concat(texts); //Make sure texts in a array
    meme.texts = textArr.map((text) => JSON.parse(text));
    // Prepare data structure for the new meme
    meme.id = Date.now();
    meme.originalImage = req.file.filename;
    meme.originalImagePath = req.file.path;
    const newFilename = `MEME_${meme.id}`;
    const newDirectory = req.file.destination;
    const newFilenameExtension = meme.originalImage.split(".").slice(-1);
    meme.outputMemePath = `${newDirectory}/${newFilename}.${newFilenameExtension}`;
    // Put text in the image
    await photohelpers.putTextOnImage(
      meme.originalImagePath,
      meme.outputMemePath,
      meme.texts
    );
    // Add the new meme to the beginning of the list and save to the json file
    meme.createdAt = Date.now();
    meme.updatedAt = Date.now();
    memes.unshift(meme);
    fs.writeFileSync("memes.json", JSON.stringify({ memes }));
    res.status(201).json(meme);
  } catch (err) {
    next(err);
  }
};

const getMemes = (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    //Read data from the json file
    let rawData = fs.readFileSync("memes.json");
    let memes = JSON.parse(rawData).memes;
    //Calculat slicing
    const totalMemes = memes.length;
    const totalPage = Math.ceil(totalMemes / perPage);
    const offset = perPage * (page - 1);
    memes = memes.slice(offset, offset + perPage);

    res.json({ success: true, data: { memes } });
  } catch (err) {
    next(err);
  }
};

const getOriginalImage = (req, res, next) => {
  try {
    const page = req.query.page || 1;
    console.log(page);
    const perPage = req.query.perPage || 10;
    //read the data from json file
    let drawData = fs.readFileSync("memes.json");
    let memes = JSON.parse(drawData).memes;
    let originalImages = memes.map((item) => item.originalImagePath);
    console.log(originalImages);
    /*   originalImage = originalImages.filter(
      (item, i, arr) => arr.indexOf(item) === i
    ); */
    /* console.log(originalImage); */
    //caculate slicing
    const totalMemes = memes.length;
    const totalPages = Math.ceil(totalMemes / perPage);
    const offset = perPage * (page - 1);
    const originalImage = originalImages.slice(offset, offset + perPage);
    res.json({
      success: "true",
      data: { originalImage, totalPages },
      message: "get original images succesful",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createMeme, getMemes, getOriginalImage };
