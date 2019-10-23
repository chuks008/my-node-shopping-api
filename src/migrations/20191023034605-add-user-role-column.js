module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('User', 'role', {
      type: Sequelize.STRING,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('User', 'role');
  },
};
