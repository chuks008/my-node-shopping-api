const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const { User } = require('../../models').models;
const error = require('../../error');

/**
 *
 * @param {*} user user model to use in signing JWT
 */
function createLoginToken(user) {
  const userData = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  return jwt.sign({ user: userData }, keys.secretOrKey);
}

/**
 *
 */
exports.updateUserById = (req, res) => {
  const newUsername = req.body.new_username;
  const userId = req.params.user_id;
  User.update({ username: newUsername }, { where: { id: userId } })
    .then(user => {
      if (!user) {
        throw new Error(error.NO_USERS_AVAILABLE);
      }

      res.json({
        message: `Success updating credentials to ${newUsername}`,
        error: false,
      });
    })
    .catch(err => {
      res.status(404).json(error.generateErrorMessage(err));
    });
};

/**
 *
 */
exports.deleteUser = (req, res) => {
  const userId = req.params.user_id;

  User.destroy({ where: { id: userId } })
    .then(success => {
      if (!success) {
        throw new Error(error.NO_USERS_AVAILABLE);
      }

      res.status(200).json({
        message: `Success deleting user with id ${userId}`,
        error: false,
      });
    })
    .catch(err => {
      res.status(404).json(error.generateErrorMessage(err));
    });
};

/**
 *
 */
exports.getUsers = (req, res) => {
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

      res.json({
        message: 'Success getting users',
        count: userResults.length,
        users: userResults,
      });
    })
    .catch(err => {
      res.status(404).json(error.generateErrorMessage(err));
    });
};

/**
 * Get a single user by user id
 */
exports.getUserById = (req, res) => {
  const userId = req.params.user_id;
  User.findOne({ where: { id: userId } })
    .then(user => {
      if (!user) {
        throw new Error(error.NO_USERS_AVAILABLE);
      }

      const currentUser = {
        user_id: user.id,
        username: user.username,
        email: user.email,
      };

      res.json({
        message: `Found one user with id ${userId}`,
        data: currentUser,
      });
    })
    .catch(err => {
      res.status(404).json(error.generateErrorMessage(err));
    });
};

/**
 * Login user into the system
 */
exports.loginUser = (req, res) => {
  const { username, password } = req.body;

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

          res.json({
            message: 'User found login success',
            data: {
              user_id: user.id,
              username: user.username,
              email: user.email,
              token: createLoginToken(user),
            },
            error: false,
          });
        })
        .catch(err => {
          res.json(error.generateErrorMessage(err));
        });
    })
    .catch(err => {
      res.json(error.generateErrorMessage(err));
    });
};

/**
 *
 */
exports.registerUser = (req, res) => {
  const { username, email, password, address } = req.body;

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

          res.status(200).json({
            message: 'User created successfully',
            data: {
              user_id: newUser.id,
              username: newUser.username,
              email: newUser.email,
              token: createLoginToken(newUser),
            },
            error: false,
          });
        })
        .catch(err => {
          res.status(500).json(error.generateErrorMessage(err));
        });
    })
    .catch(err => {
      res.status(500).json(error.generateErrorMessage(err));
    });
};
