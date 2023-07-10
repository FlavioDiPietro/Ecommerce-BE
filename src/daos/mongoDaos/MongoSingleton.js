const mongoose = require("mongoose");
const logger = require("../../logger/customLogger");

class MongoSingleton {
  static #instance;
  constructor() {}

  static async connect(mongoUrl) {
    if (this.#instance) {
      logger.info("Mongo already connected");
      return this.#instance;
    } else {
      this.#instance = new MongoSingleton(mongoUrl);
      try {
        await mongoose.connect(mongoUrl, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        logger.info("Mongo connect succesfull");
      } catch (err) {
        logger.error(`${err} Error al conectar a la db`);
      }
    }
  }
}

module.exports = MongoSingleton;
