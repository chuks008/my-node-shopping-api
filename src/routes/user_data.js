const express = require('express');

const router = express.Router();
const validation = require('../middleware/validation');
const userController = require('../controllers/users');

router.post('/register', validation.validateRegistration, userController.registerUser);
router.post('/login', validation.validateLogin, userController.loginUser);
router.get('/', userController.getUsers);
router.get('/:user_id', userController.getUserById);
router.delete('/:user_id', userController.deleteUser);
router.put('/:user_id', userController.updateUserById);

module.exports = router;
