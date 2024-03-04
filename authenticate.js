var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var User = require('./models/User.js');
var config = require('./config.js');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
  return jwt.sign(user, config.secretKey,
    { expiresIn: 3600 });
};


// bắt buộc phải dùng promise không dùng được callback
exports.jwtPassport = passport.use(
  new JwtStrategy(
      {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: config.secretKey,
      },
      (jwt_payload, done) => {
          User.findOne({ _id: jwt_payload._id })
              .then(user => {
                  if (user) {
                      return done(null, user);
                  } else {
                      return done(null, false);
                  }
              })
              .catch(err => done(err, false));
      }
  )
);



exports.verifyUser = passport.authenticate('jwt', { session: false });