module.exports = {
  validateRegistration: (req, res, next) => {
    const registrationInputs = ['username', 'email', 'password', 'address'];
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

    if(Object.keys(req.body).length === 0) {
       return res.status(403).json({
        "message": "username, password missing from the request"
      })
    };

    const loginInputs = ['username', 'password'];

    const validation = validateInputs(req.body, loginInputs);

    if (validation.errorCount > 0) {

      res.json({
        message: validation.message,
      }).status(403);

    } else {
      next();
    }
  },
};

function validateInputs(reqObj, inputs) {
  const reqKeys = Object.keys(reqObj);

  let errorCount = 0;
  let errorMessage = '';

  for (let i = 0; i < inputs.length; i++) {
    const currentKey = inputs[i];
    if (reqKeys.includes(currentKey)) {
      if (reqObj[currentKey].length === 0) {
        errorCount++;
        errorMessage = `${errorMessage}${currentKey}, `;
      }
    } else {
      errorCount++;
      errorMessage = `${errorMessage}${currentKey}, `;
    }
  }

  if (errorCount > 0) {
    errorMessage = errorMessage.substring(0, errorMessage.length - 2);
    errorMessage = `${errorMessage} missing from the input values`;
  }

  return {
    errorCount,
    message: errorMessage,
  };
}
