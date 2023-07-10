const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const logger = require("../logger/customLogger");
const { jwt: cookieField, jwt_secret } = require("../config/config");

const JWTStrategy = Strategy;
const ExtractJWT = ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[cookieField];
  }
  logger.info(`authenticateToken:${token}`);
  return token;
};

const initializePassport = () => {
  passport.use(
    "current",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: jwt_secret,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};

module.exports = initializePassport;
