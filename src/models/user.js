const bcrypt = require('bcrypt');
const error = require('../error');

const userModel = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      hooks: {
        // define hooks to perform hashing on the password
        // eslint-disable-next-line no-unused-vars
        beforeCreate(user, _options) {
          return (
            bcrypt
              .hash(user.password, 10)
              .then(hash => {
                // eslint-disable-next-line no-param-reassign
                user.password = hash;
              })
              // eslint-disable-next-line no-unused-vars
              .catch(_err => {
                throw new Error(error.GENERAL_SERVER_ERROR);
              })
          );
        },
      },
    },
  );

  return User;
};

module.exports = userModel;
