const { uploader } = require("../utils/uploader");

const uploaderMid = (req, res, next) => {
  const { kind } = req.params;
  uploader.single("myfile");
};

module.exports = uploaderMid;
