exports.validateInputs = (reqObj, inputs) => {
  const reqKeys = Object.keys(reqObj);

  let errorCount = 0;
  let errorMessage = '';

  for (let i = 0; i < inputs.length; i += 1) {
    const currentKey = inputs[i];
    if (reqKeys.includes(currentKey)) {
      if (reqObj[currentKey].length === 0) {
        errorCount += 1;
        errorMessage = `${errorMessage}${currentKey} value, `;
      }
    } else {
      errorCount += 1;
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
};

exports.isRequestEmpty = requestBody => {
  return Object.keys(requestBody).length === 0;
};
