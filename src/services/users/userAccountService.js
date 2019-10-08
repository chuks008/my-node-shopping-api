const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const { User } = require('../../models').models;
const error = require('../../error');

module.exports = () => {
  /* Define method to create user token */
  function createLoginToken(user) {
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    return jwt.sign({ user: userData }, keys.secretOrKey);
  }

  /* Exportable methods for user account service */
  return {
    updateUserCredentialsById: async (
      userId,
      oldUsername,
      newUsername,
    ) => {
      try {
        const updatedUserCount = await User.update(
          { username: newUsername },
          { where: { id: userId, username: oldUsername } },
        );

        console.log('Updated user: ', updatedUserCount);

        if (updatedUserCount < 1) {
          throw new Error(error.NO_USERS_AVAILABLE);
        }

        return {
          message: `Success updating credentials to ${newUsername}`,
          error: false,
        };
      } catch (err) {
        return error.generateErrorMessage(err);
      }
    },

    deleteUserById: userId => {
      User.destroy({ where: { id: userId } })
        .then(success => {
          if (!success) {
            throw new Error(error.NO_USERS_AVAILABLE);
          }

          return {
            message: `Success deleting user with id ${userId}`,
            error: false,
          };
        })
        .catch(err => {
          return error.generateErrorMessage(err);
        });
    },

    getUsers: async () => {
      try {
        const users = await User.findAll();

        if (!users) {
          throw new Error(error.NO_USERS_AVAILABLE);
        }

        const userResults = users.map(user => ({
          id: user.id,
          username: user.username,
          email: user.email,
        }));

        return {
          message: 'Success getting users',
          count: userResults.length,
          users: userResults,
          error: false,
        };
      } catch (err) {
        return error.generateErrorMessage(err);
      }
    },

    findUserById: async userId => {
      try {
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
          throw new Error(error.NO_USERS_AVAILABLE);
        }

        const currentUser = {
          user_id: user.id,
          username: user.username,
          email: user.email,
        };

        return {
          message: `Found one user with id ${userId}`,
          data: currentUser,
          error: false,
        };
      } catch (err) {
        return error.generateErrorMessage(err);
      }
    },

    loginUser: async (username, password) => {
      try {
        const currentUser = await User.findOne({
          where: { username },
        });

        if (!currentUser) {
          throw new Error(error.NO_USERS_AVAILABLE);
        }

        const passwordMatch = await bcrypt.compare(
          password,
          currentUser.password,
        );

        if (!passwordMatch) {
          throw new Error(error.INCORRECT_CREDENTIALS);
        }

        return {
          message: 'User found login success',
          data: {
            user_id: currentUser.id,
            username: currentUser.username,
            email: currentUser.email,
            token: createLoginToken(currentUser),
          },
          error: false,
        };
      } catch (err) {
        return error.generateErrorMessage(err);
      }
    },

    registerUser: async (username, email, password, address) => {
      try {
        const existingUser = await User.findOne({
          where: { [Op.or]: [{ username }, { email }] },
        });
        if (existingUser) {
          // the user already exists, so return an error
          throw new Error(error.USER_ALREADY_TAKEN);
        }

        const newUser = await User.create({
          username,
          email,
          password,
          address,
        });

        if (!newUser) {
          throw new Error(error.GENERAL_SERVER_ERROR);
        }

        return {
          message: 'User created successfully',
          data: {
            user_id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            token: createLoginToken(newUser),
          },
          error: false,
        };
      } catch (err) {
        return error.generateErrorMessage(err);
      }
    },
  };
};
