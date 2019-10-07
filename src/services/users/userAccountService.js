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
    updateUserCredentialsById: (userId, newUsername) => {
      User.update(
        { username: newUsername },
        { where: { id: userId } },
      )
        .then(user => {
          if (!user) {
            throw new Error(error.NO_USERS_AVAILABLE);
          }

          return {
            message: `Success updating credentials to ${newUsername}`,
            error: false,
          };
        })
        .catch(err => {
          return error.generateErrorMessage(err);
        });
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

    getUsers: () => {
      User.findAll()
        .then(users => {
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
        })
        .catch(err => {
          return error.generateErrorMessage(err);
        });
    },

    findUserById: async userId => {
      try {
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
          return error.generateErrorMessage(
            new Error(error.NO_USERS_AVAILABLE),
          );
        }

        const currentUser = {
          user_id: user.id,
          username: user.username,
          email: user.email,
        };

        console.log('Current user found:  ****', currentUser.user_id);

        return {
          message: `Found one user with id ${userId}`,
          data: currentUser,
          error: false,
        };
      } catch (err) {
        return error.generateErrorMessage(err);
      }
    },

    loginUser: (username, password) => {
      User.findOne({
        where: { username },
      })
        .then(user => {
          if (!user) {
            throw new Error(error.NO_USERS_AVAILABLE);
          }

          bcrypt
            .compare(password, user.password)
            .then(equal => {
              if (!equal) {
                throw new Error(error.INCORRECT_CREDENTIALS);
              }

              return {
                message: 'User found login success',
                data: {
                  user_id: user.id,
                  username: user.username,
                  email: user.email,
                  token: createLoginToken(user),
                },
                error: false,
              };
            })
            .catch(err => {
              return error.generateErrorMessage(err);
            });
        })
        .catch(err => {
          return error.generateErrorMessage(err);
        });
    },

    registerUser: (username, email, password, address) => {
      User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
        },
      })
        .then(user => {
          if (user) {
            // the user already exists, so return an error
            throw new Error(error.USER_ALREADY_TAKEN);
          }

          User.create({
            username,
            email,
            password,
            address,
          })
            .then(newUser => {
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
            })
            .catch(err => {
              return error.generateErrorMessage(err);
            });
        })
        .catch(err => {
          return error.generateErrorMessage(err);
        });
    },
  };
};
