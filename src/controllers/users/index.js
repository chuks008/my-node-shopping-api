const error = require('../../error');

module.exports = userAccountService => {
  return {
    updateUserById: async (req, res) => {
      const newUsername = req.body.new_username;
      const oldUsername = req.body.old_username;
      const userId = req.params.user_id;

      const updateResult = await userAccountService.updateUserCredentialsById(
        userId,
        oldUsername,
        newUsername,
      );

      if (updateResult.error === true) {
        res.status(404).json(updateResult);
      } else {
        res.status(200).json(updateResult);
      }
    },

    deleteUser: async (req, res) => {
      const userId = req.params.user_id;

      const deleteResult = await userAccountService.deleteUserById(
        userId,
      );

      if (deleteResult.error === true) {
        res.status(404).json(deleteResult);
      } else {
        res.status(200).json(deleteResult);
      }
    },

    getUsers: async (req, res) => {
      const userResults = await userAccountService.getUsers();

      if (userResults.error === true) {
        res.status(404).json(userResults);
      } else {
        const response = {
          message: 'Success getting users',
          count: userResults.users.length,
          users: userResults.users,
          error: false,
        };
        res.status(200).json(response);
      }
    },

    getUserById: async (req, res) => {
      const userId = req.params.user_id;
      const userResult = await userAccountService.findUserById(
        userId,
      );

      if (userResult.error === true) {
        res
          .status(error.getErrorCode(userResult.message))
          .json(userResult);
      } else {
        const successResponse = {
          message: `Found one user with id ${userId}`,
          data: userResult.user,
          error: false,
        };

        res.status(200).json(successResponse);
      }
    },

    loginUser: async (req, res) => {
      const { username, password } = req.body;

      const loginResult = await userAccountService.loginUser(
        username,
        password,
      );

      if (loginResult.error === true) {
        res
          .status(error.getErrorCode(loginResult.message))
          .json(loginResult);
      } else {
        res.status(200).json(loginResult);
      }
    },

    registerUser: async (req, res) => {
      const { username, email, password, address } = req.body;

      const registerResult = await userAccountService.registerUser(
        username,
        email,
        password,
        address,
      );

      if (registerResult.error === true) {
        res
          .status(error.getErrorCode(registerResult.message))
          .json(registerResult);
      } else {
        res.redirect(307, '/user/login');
      }
    },
  };
};
