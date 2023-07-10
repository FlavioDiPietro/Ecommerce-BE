const logger = require("../logger/customLogger");
const addLogger = (req, res, next) => {
  req.logger = logger;
  next();
};

module.exports = { addLogger };
