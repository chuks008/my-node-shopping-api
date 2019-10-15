module.exports = {
  up: queryInterface =>
    queryInterface.sequelize.query(
      "ALTER TABLE users ALTER COLUMN id set default nextval('users_id_seq');",
    ),

  down: queryInterface =>
    queryInterface.sequelize.query(
      'ALTER TABLE users ALTER COLUMN id DROP DEFAULT',
    ),
};
