module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize.query(
      "ALTER TABLE users ALTER COLUMN id set default nextval('users_id_seq');",
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.sequelize.query(
      'ALTER TABLE users ALTER COLUMN id DROP DEFAULT',
    ),
};
