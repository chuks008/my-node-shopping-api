const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize.Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: 'postgres',
    define: {
      freezeTableName: true,
    },
  },
);

const models = {
  User: sequelize.import('./user'),
  Product: sequelize.import('./product'),
  ProductCategory: sequelize.import('./product_category'),
};

module.exports = { sequelize, models };
