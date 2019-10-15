const passport = require('passport');

module.exports = strategy => {
  const authentication = (req, res, next) => {
    passport.authenticate(
      strategy,
      { session: false },
      (err, user) => {
        if (err) {
          return res.status(500).json({
            message: err.message,
            error: true,
          });
        }

        if (!user) {
          return res.status(401).json({
            message:
              'User is not authenticated to view this resource',
            error: true,
          });
        }

        req.user = user;
        return next();
      },
    )(req, res, next);
  };

  return authentication;
};
