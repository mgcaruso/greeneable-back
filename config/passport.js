const passport = require("passport");
const jwtStrategy = require("passport-jwt").Strategy; //defining what I'm going to do with the token received
const extractJwt = require("passport-jwt").ExtractJwt; //to enable the extraction of the token

const User = require("../models/user");

module.exports = passport.use(
  new jwtStrategy(
    {
      jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(), //recibimos el token
      secretOrKey: process.env.SECRET_KEY, //recibimos la secret key . si todo está ok pasa al cuerpo
    },
    (jwt_payload, done) => {
      //extracting the body of the token (payload)
      User.findOne({ _id: jwt_payload.id })

        .then((user) => {
          if (user) {
            //if user exists
            return done(null, user);
          } else if (err) {
            console.log(err);
            return done(err, false);
          }
        })
        .catch((err) => {
          console.log(err.status);
          return done(err, false);
        });
    }
  )
);
