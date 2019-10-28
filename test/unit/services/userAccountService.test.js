const sinon = require('sinon');
const assert = require('assert');
const { expect } = require('chai');
const bcrypt = require('bcrypt');
const error = require('../../../src/error');
const { User } = require('../../../src/models').models;
const sut = require('../../../src/services/users/userAccountService')(
  User,
  bcrypt,
);

describe('User Account Service tests suite', () => {
  describe('Get all users tests', () => {
    afterEach(() => {
      User.findAll.restore();
    });

    it('should return a response error when no users exists', async () => {
      sinon.stub(User, 'findAll').resolves(null);
      const errorResponse = await sut.getUsers();

      assert.equal(errorResponse.message, error.NO_USERS_AVAILABLE);
      expect(errorResponse.error).to.been.true;
    });

    it('should return a success response when users are found', async () => {
      const users = [
        {
          id: 1,
          username: 'username002',
          email: 'username002@mail.com',
          address: '123 Address',
        },
        {
          id: 12,
          username: 'username012',
          email: 'username012@mail.com',
          address: '345 Address',
        },
      ];

      sinon.stub(User, 'findAll').resolves(users);
      const successResponse = await sut.getUsers();

      assert.equal(successResponse.message, 'Success getting users');
      assert.equal(successResponse.users.length, 2);
      expect(successResponse.error).to.be.false;
    });
  });

  describe('Get user by id tests', () => {
    afterEach(() => {
      User.findOne.restore();
    });

    it('should return a response error when no users exists', async () => {
      const userId = 15;
      sinon.stub(User, 'findOne').resolves(null);
      const errorResponse = await sut.findUserById(userId);

      assert.equal(errorResponse.message, error.NO_USERS_AVAILABLE);
      expect(errorResponse.error).to.been.true;
    });

    it('should return a success response when a user is found', async () => {
      const userId = 1;
      const foundUser = {
        id: 1,
        username: 'username002',
        email: 'username002@mail.com',
        address: '123 Address',
      };

      sinon.stub(User, 'findOne').resolves(foundUser);
      const successResponse = await sut.findUserById(userId);

      expect(successResponse.user).to.have.keys(
        'user_id',
        'email',
        'username',
      );
      expect(successResponse.error).to.be.false;
    });
  });

  describe('Update user credentials tests', () => {
    const userId = 19;
    const oldUsername = 'usernameOld34';
    const newUsername = 'usernameNew47';

    afterEach(() => {
      User.update.restore();
    });

    it('should return an error object when a user is not found', async () => {
      sinon.stub(User, 'update').resolves(0);
      const updateResult = await sut.updateUserCredentialsById(
        userId,
        oldUsername,
        newUsername,
      );

      assert.equal(updateResult.message, error.NO_USERS_AVAILABLE);
      assert.equal(updateResult.error, true);
    });

    it('should return a success response when a user is successfully updated', async () => {
      sinon.stub(User, 'update').resolves(1);
      const updateResult = await sut.updateUserCredentialsById(
        userId,
        oldUsername,
        newUsername,
      );

      assert.equal(
        updateResult.message,
        `Success updating credentials to ${newUsername}`,
      );
      assert.equal(updateResult.error, false);
    });
  });

  describe('Delete user tests', () => {
    const userId = 1000;

    afterEach(() => {
      User.destroy.restore();
    });

    it('should return an error when the user does not exist', async () => {
      sinon.stub(User, 'destroy').resolves(null);
      const deleteResult = await sut.deleteUserById(userId);

      expect(deleteResult.error).to.be.true;
      expect(deleteResult.message).to.equal(error.NO_USERS_AVAILABLE);
    });

    it('should return a success when the user is deleted', async () => {
      const deleteUser = {
        id: 1000,
        username: 'username002',
        email: 'username002@mail.com',
        address: '123 Address',
      };

      sinon.stub(User, 'destroy').resolves(deleteUser);
      const deleteResult = await sut.deleteUserById(userId);

      expect(deleteResult.error).to.be.false;
      expect(deleteResult.message).to.equal(
        `Success deleting user with id ${userId}`,
      );
    });
  });

  describe('Login user tests', () => {
    const username = 'username99';
    const password = 'password';

    afterEach(() => {
      User.findOne.restore();
    });

    it('should return an invalid credentials error if the user does not exist', async () => {
      sinon.stub(User, 'findOne').resolves(null);
      const loginResponse = await sut.loginUser(username, password);

      expect(loginResponse).not.to.have.key('data');
      expect(loginResponse.error).to.be.true;
      expect(loginResponse.message).to.equal(
        error.INCORRECT_CREDENTIALS,
      );
    });

    it('should return an invalid credentials error if the user password is incorrect', async () => {
      const foundUser = {
        id: 16,
        username: 'username002',
        email: 'username002@mail.com',
        address: '123 Address',
        password: 'password',
      };

      sinon.stub(User, 'findOne').resolves(foundUser);
      sinon.stub(bcrypt, 'compare').resolves(false);
      const loginResponse = await sut.loginUser(username, password);

      expect(loginResponse).not.to.have.key('data');
      expect(loginResponse.error).to.be.true;
      expect(loginResponse.message).to.equal(
        error.INCORRECT_CREDENTIALS,
      );

      bcrypt.compare.restore();
    });

    it('should return a success response if the user credentials are valid', async () => {
      const foundUser = {
        id: 16,
        username: 'username002',
        email: 'username002@mail.com',
        address: '123 Address',
        password: 'password',
      };

      sinon.stub(User, 'findOne').resolves(foundUser);
      sinon.stub(bcrypt, 'compare').resolves(true);
      const loginResponse = await sut.loginUser(username, password);

      expect(loginResponse).to.have.keys('data', 'message', 'data');
      expect(loginResponse.data).to.have.keys(
        'user_id',
        'username',
        'email',
        'token',
      );
      expect(loginResponse.error).to.be.false;
      expect(loginResponse.message).to.equal(
        'User successfully logged in',
      );
    });
  });

  describe('Register user tests', () => {
    const username = 'usernamehtml928';
    const email = 'email928@email.com';
    const password = 'password';
    const address = '';

    const existingUser = {
      id: 72,
      username,
      email,
      password,
      address,
    };

    afterEach(() => {
      User.findOne.restore();
    });

    it('should return a user exists error when registering an existing user', async () => {
      sinon.stub(User, 'findOne').resolves(existingUser);
      const registrationResponse = await sut.registerUser(
        username,
        email,
        password,
        address,
      );

      expect(registrationResponse.error).to.be.true;
      expect(registrationResponse.message).to.equal(
        error.USER_ALREADY_TAKEN,
      );
    });

    it('should return general error when new user registration fails', async () => {
      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(User, 'create').resolves(null);
      const registrationResponse = await sut.registerUser(
        username,
        email,
        password,
        address,
      );

      expect(registrationResponse.error).to.be.true;
      expect(registrationResponse.message).to.equal(
        error.GENERAL_SERVER_ERROR,
      );

      User.create.restore();
    });

    it('should return success response when user created successfully', async () => {
      const newUsername = 'constantinos910';
      const newEmail = 'constantinos910@mail.com';

      const newUser = {
        id: 73,
        newUsername,
        newEmail,
        password,
        address,
        role: 'user',
      };

      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(User, 'create').resolves(newUser);
      const registrationResponse = await sut.registerUser(
        newUsername,
        newEmail,
        password,
        address,
      );

      expect(registrationResponse).to.have.keys(
        'error',
        'message',
        'data',
      );
      expect(registrationResponse.data).to.have.key('username');
      expect(registrationResponse.error).to.be.false;
      expect(registrationResponse.message).to.equal(
        'User created successfully',
      );

      User.create.restore();
    });
  });
});
