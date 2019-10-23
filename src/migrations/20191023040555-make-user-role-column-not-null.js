module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('User', 'role', {
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('User', 'role', {
      role: {
        type: Sequelize.STRING,
      },
    });
  },
};
