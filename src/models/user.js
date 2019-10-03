const bcrypt = require('bcrypt');

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
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
      validate: {
        notEmpty: true,
      },
    },
  }, {
    hooks: { // define hooks to perform hashing on the password
      beforeCreate(user, options) {
        return bcrypt.hash(user.password, 10)
          .then((hash) => {
            user.password = hash;
          })
          .catch((err) => {
            throw new Error(error.GENERAL_SERVER_ERROR);
          });
      },
    },
  });

  return User;
};

module.exports = user;
