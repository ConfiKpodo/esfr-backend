const multer = require("multer");
const path = require("path");

// Render only allows writing inside /tmp
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/tmp");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + path.extname(file.originalname);
    req.savedFilename = unique; // keep reference
    cb(null, unique);
  },
});

const upload = multer({ storage });

module.exports = upload;
