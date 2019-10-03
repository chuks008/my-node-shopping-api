'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.query('ALTER TABLE users DROP CONSTRAINT users_pkey, ALTER id DROP NOT NULL, ADD PRIMARY KEY (id)'),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn('users',
    'id', {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    }),
};
