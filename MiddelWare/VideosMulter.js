const multer  = require("multer")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads'); // Set the destination folder where uploaded files will be stored
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9) + file.originalname;
      cb(null,uniqueSuffix); // Set the filename for the uploaded file
    },
  });

  const uploadvideo = multer({ storage: storage }).single('video');
  module.exports = {uploadvideo}
