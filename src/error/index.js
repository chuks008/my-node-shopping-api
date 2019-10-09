module.exports = {
  INCORRECT_CREDENTIALS: 'Incorrect username/password provided',
  USER_ALREADY_TAKEN:
    'This username has already been taken. Select a different username',
  GENERAL_SERVER_ERROR:
    'General server error fetching data from database',
  NO_USERS_AVAILABLE: 'No users currently registered',
  generateErrorMessage: err => ({
    message: err.message,
    error: true,
  }),
  getErrorCode(errorMessage) {
    switch (errorMessage) {
      case this.USER_ALREADY_TAKEN:
        return 409;
      case this.GENERAL_SERVER_ERROR:
        return 503;
      case this.INCORRECT_CREDENTIALS:
        return 403;
      case this.NO_USERS_AVAILABLE:
        return 404;
      default:
        return 500;
    }
  },
};
