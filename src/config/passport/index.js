const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const { User } = require('../../models').models;
const keys = require('../keys');

module.exports = passport => {
  passport.use(
    'jwt',
    new JWTstrategy(
      {
        secretOrKey: keys.secretOrKey,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      },
      (jwtPayload, done) => {
        process.nextTick(() => {
          User.findOne({ where: { id: jwtPayload.user.id } })
            .then(user => {
              if (!user) {
                return done(null, false);
              }

              return done(null, user);
            })
            .catch(err => {
              console.log('Error found while completing auth: ', err);
              return done(null, false);
            });
        });
      },
    ),
  );
};
