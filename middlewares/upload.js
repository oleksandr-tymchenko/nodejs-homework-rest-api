const multer = require("multer");
const path = require("path");

// шлях до тимч папки
const tmpDir = path.join(__dirname, "../", "tmp");

// налашт
const multerConfig = multer.diskStorage({
  destination: tmpDir,
    filename: (req, file, cb) => {
      cb(null, file.originalname)
  },
});

// create middlewar
const upload = multer({
    storage: multerConfig
})

module.exports = upload;