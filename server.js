const express = require('express');
const passport = require('passport');

const app = express();
const userRoutes = require('./src/routes/user_data');
const testRoute = require('./src/routes');
const { sequelize } = require('./src/models');
require('dotenv').config();
require('./src/config/passport')(passport); // set up passport with all strategies

sequelize.sync().then(() => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  const PORT = process.env.PORT || 3000;

  app.use(passport.initialize());

  app.use('/user', userRoutes);
  app.use('/', testRoute);

  app.listen(PORT, () => {
    console.log(`Chai testing is listening on port ${PORT}`);
  });
});

module.exports = app;
