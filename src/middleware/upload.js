const multer = require("multer");
const path = require("path");

const ALLOWED = [".txt", ".md", ".csv", ".json"];

module.exports = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED.includes(ext)) return cb(null, true);
    const err = new Error(`Only ${ALLOWED.join(", ")} files are allowed`);
    err.status = 400;
    cb(err);
  },
});
