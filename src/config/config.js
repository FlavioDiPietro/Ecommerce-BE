const MongoStore = require("connect-mongo");
const MongoSingleton = require("../daos/mongoDaos/MongoSingleton");
const program = require("../../process");

const { mode } = program.opts();

require("dotenv").config({
  path: mode === "DEVELOPMENT" ? "./.env.development" : "./.env.production",
});
const mongoUrl = process.env.MONGO_URL;

const config = {
  port: process.env.PORT,
  jwt: process.env.COOKIE_FIELD,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  persistence: process.env.PERSISTENCE,
  jwt_secret: process.env.JWT_SECRET,
  dbConection: () => MongoSingleton.connect(mongoUrl),
  session: {
    store: MongoStore.create({
      mongoUrl: mongoUrl,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 130000000,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUnitialized: false,
  },
  mailing: {
    testUser: process.env.MAIL_USER,
    testPassword: process.env.MAIL_PASS,
    twilioSid: process.env.TWILIO_ACCOUNT_SID,
    twilioToken: process.env.TWILIO_AUTH_TOKEN,
    twilioPhone: process.env.TWILIO_PHONE,
    ownPhone: process.env.MY_PHONE,
  },
};

module.exports = config;
