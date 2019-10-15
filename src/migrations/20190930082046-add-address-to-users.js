module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'address', {
      type: Sequelize.STRING,
    }),

  down: queryInterface =>
    queryInterface.removeColumn('users', 'address'),
};
