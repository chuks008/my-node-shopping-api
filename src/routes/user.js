const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const validation = require('../middleware/validation');
const { User } = require('../models').models;
const userAccountService = require('../services/users/userAccountService')(
  User,
  bcrypt,
);
const userController = require('../controllers/users')(
  userAccountService,
);
const jwtAuth = require('../middleware/auth')('jwt');
const roleAuth = require('../middleware/role');
const roles = require('../middleware/role/roles');

router.post(
  '/register',
  validation.validateRegistration,
  userController.registerUser,
);

router.post(
  '/login',
  validation.validateLogin,
  userController.loginUser,
);

// protect remaining routes with jwt auth
router.use(jwtAuth);

router.get(
  '/:user_id',
  roleAuth([roles.Admin, roles.User]),
  userController.getUserById,
);
router.get('/', roleAuth([roles.Admin]), userController.getUsers);

router.get(
  '/:user_id',
  roleAuth([roles.User, roles.Admin]),
  userController.getUserById,
);

router.delete(
  '/:user_id',
  roleAuth([roles.User, roles.Admin]),
  userController.deleteUser,
);

router.put(
  '/:user_id',
  roleAuth([roles.User, roles.Admin]),
  userController.updateUserById,
);

module.exports = router;
