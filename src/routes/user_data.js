const express = require('express');

const router = express.Router();
const validation = require('../middleware/validation');
const userAccountService = require('../services/users/userAccountService')();
const userController = require('../controllers/users')(
  userAccountService,
);
const jwtAuth = require('../middleware/auth')('jwt');

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

router.get('/:user_id', userController.getUserById);
router.get('/', userController.getUsers);
router.get('/:user_id', userController.getUserById);
router.delete('/:user_id', userController.deleteUser);
router.put('/:user_id', userController.updateUserById);

module.exports = router;
