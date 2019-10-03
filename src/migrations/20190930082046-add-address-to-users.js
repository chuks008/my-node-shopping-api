'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('users',
    'address',
    {
      type: Sequelize.STRING,
    }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('users', 'address'),
};
