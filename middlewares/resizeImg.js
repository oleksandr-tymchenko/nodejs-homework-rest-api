const Jimp = require("jimp");

const resizeImg = async (req, res, next) => {
  const uploadedFile = req.file;

  if (!uploadedFile) {
    return next();
  }

  const image = await Jimp.read(uploadedFile.path);
  await image.resize(250, 250);

  await image.write(uploadedFile.path);

  next();
};

module.exports = resizeImg;
