module.exports = userAccountService => {
  return {
    updateUserById: (req, res) => {
      const newUsername = req.body.new_username;
      const userId = req.params.user_id;

      const updateResult = userAccountService.updateUserCredentialsById(
        newUsername,
        userId,
      );

      if (updateResult.error === true) {
        res.status(404).json(updateResult);
      } else {
        res.status(200).json(updateResult);
      }
    },

    deleteUser: (req, res) => {
      const userId = req.params.user_id;

      const deleteResult = userAccountService.deleteUserById(userId);

      if (deleteResult.error === true) {
        res.status(404).json(deleteResult);
      } else {
        res.status(200).json(deleteResult);
      }
    },

    getUsers: (req, res) => {
      const userResults = userAccountService.getUsers();

      if (userResults.error === true) {
        res.status(404).json(userResults);
      } else {
        res.status(200).json(userResults);
      }
    },

    getUserById: (req, res) => {
      const userId = req.params.user_id;

      console.log('Getting user by id: ', userId);

      const userResult = userAccountService.findUserById(userId);
      console.log(userResult);

      if (userResult.error === true) {
        res.status(404).json(userResult);
      } else {
        res.status(200).json(userResult);
      }
    },

    loginUser: (req, res) => {
      const { username, password } = req.body;

      const loginResult = userAccountService.loginUser(
        username,
        password,
      );

      if (loginResult.error === true) {
        res.status(404).json(loginResult);
      } else {
        res.status(200).json(loginResult);
      }
    },
    registerUser: (req, res) => {
      const { username, email, password, address } = req.body;

      const registerResult = userAccountService.registerUser(
        username,
        email,
        password,
        address,
      );

      if (registerResult.error === true) {
        res.status(404).json(registerResult);
      } else {
        res.status(200).json(registerResult);
      }
    },
  };
};
