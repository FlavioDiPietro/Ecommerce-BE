const multer = require("multer");
const path = require("path");

const setUrl = (body) => {
  const folder = body.nombre
    ? "profiles"
    : body.title
    ? "products"
    : "documents";
  return path.join(__dirname, "..", "uploads", folder);
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, setUrl(req.body));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploader = multer({
  storage,
  onError: (err, next) => {
    err ? console.log(err) : next();
  },
});

module.exports = {
  uploader,
};
