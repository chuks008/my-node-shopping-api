const express = require('express');

const app = express();
const router = require('./routes');
const operationRoutes = require('./routes/operations');
const userRoutes = require('./routes/user_data');
const { sequelize } = require('./models');

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const PORT = process.env.PORT || 3000;

app.use('/', router);
app.use('/operation', operationRoutes);
app.use('/user', userRoutes);


sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Chai testing is listening on port ${PORT}`);
  });
});

module.exports = app;
