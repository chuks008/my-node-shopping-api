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
};
