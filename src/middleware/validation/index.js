const {
  validateInputs,
  isRequestEmpty,
} = require('../../util/validation/fieldValidation');

module.exports = {
  validateRegistration: (req, res, next) => {
    if (isRequestEmpty(req.body)) {
      res.status(403).json({
        message: 'username, email, password missing from the request',
      });

      return;
    }

    const registrationInputs = ['username', 'email', 'password'];
    const validation = validateInputs(req.body, registrationInputs);

    if (validation.errorCount > 0) {
      res.status(403).json({
        message: validation.message,
      });
    } else {
      next();
    }
  },
  validateLogin: (req, res, next) => {
    if (isRequestEmpty(req.body)) {
      res.status(403).json({
        message: 'username, password missing from the request',
      });

      return;
    }

    const loginInputs = ['username', 'password'];

    const validation = validateInputs(req.body, loginInputs);

    if (validation.errorCount > 0) {
      res.status(403).json({
        message: validation.message,
      });
    } else {
      next();
    }
  },
};
