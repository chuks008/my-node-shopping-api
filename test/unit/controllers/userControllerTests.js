const sinon = require('sinon');
const { expect } = require('chai');
const assert = require('assert');
const userService = require('../../../src/services/users/userAccountService')();
const error = require('../../../src/error');
const sut = require('../../../src/controllers/users')(userService);

describe('User Controller tests suite', () => {
  let res;
  let status;
  let json;
  const req = {};

  beforeEach(() => {
    status = sinon.stub();
    json = sinon.spy();
    res = { json, status };
    status.returns(res);
  });

  describe('registration method tests', () => {
    afterEach(() => {
      userService.registerUser.restore();
    });

    it('should call user service registerUser with correct parameters', async () => {
      const username = 'username007';
      const email = 'username007@gmail.com';
      const password = 'password';
      const address = '123 Aukey Address';

      req.body = {
        username,
        email,
        password,
        address,
      };

      sinon.stub(userService, 'registerUser').resolves('');

      await sut.registerUser(req, res);

      sinon.assert.calledWith(
        userService.registerUser,
        username,
        email,
        password,
        address,
      );
    });

    it('should send error json response for existing user with http error 409', async () => {
      const errorResponse = {
        message: error.USER_ALREADY_TAKEN,
        error: true,
      };

      sinon.stub(userService, 'registerUser').resolves(errorResponse);

      await sut.registerUser(req, res);

      sinon.assert.calledWith(res.json, errorResponse);
      sinon.assert.calledWith(res.status, 409);
    });

    it('should send error json response for general server error with http error 503', async () => {
      const errorResponse = {
        message: error.GENERAL_SERVER_ERROR,
        error: true,
      };

      sinon.stub(userService, 'registerUser').resolves(errorResponse);
      await sut.registerUser(req, res);

      sinon.assert.calledWith(res.json, errorResponse);
      sinon.assert.calledWith(res.status, 503);
    });

    it('should send success json response when user created successfully with http code 200', async () => {
      const successResponse = {
        message: '',
        data: {},
        error: false,
      };

      sinon
        .stub(userService, 'registerUser')
        .resolves(successResponse);

      await sut.registerUser(req, res);

      sinon.assert.calledWith(res.status, 200);
    });
  });

  // loginn tests
  describe('login method tests', () => {
    afterEach(() => {
      userService.loginUser.restore();
    });

    it('should call user service loginUser with correct parameters', async () => {
      const username = 'username007';
      const password = 'password';

      req.body = {
        username,
        password,
      };

      sinon.stub(userService, 'loginUser').resolves('');

      await sut.loginUser(req, res);

      sinon.assert.calledWith(
        userService.loginUser,
        username,
        password,
      );
    });

    it('should send error json response for non-existing user with http error 404', async () => {
      const errorResponse = {
        message: error.NO_USERS_AVAILABLE,
        error: true,
      };

      sinon.stub(userService, 'loginUser').resolves(errorResponse);

      await sut.loginUser(req, res);

      sinon.assert.calledWith(res.json, errorResponse);
      sinon.assert.calledWith(res.status, 404);
    });

    it('should send error json response for incorrect credentials with http error 403', async () => {
      const errorResponse = {
        message: error.INCORRECT_CREDENTIALS,
        error: true,
      };

      sinon.stub(userService, 'loginUser').resolves(errorResponse);
      await sut.loginUser(req, res);

      sinon.assert.calledWith(res.json, errorResponse);
      sinon.assert.calledWith(res.status, 403);
    });

    it('should send success json response when user logged in successfully with http code 200', async () => {
      const successResponse = {
        message: '',
        data: {},
        error: false,
      };

      sinon.stub(userService, 'loginUser').resolves(successResponse);

      await sut.loginUser(req, res);

      sinon.assert.calledWith(res.status, 200);
    });
  });

  describe('update user method tests', () => {
    afterEach(() => {
      userService.updateUserCredentialsById.restore();
    });

    it("should send error json response when user doesn't exist with http code 404", async () => {
      const errorResponse = {
        message: error.NO_USERS_AVAILABLE,
        error: true,
      };

      sinon
        .stub(userService, 'updateUserCredentialsById')
        .resolves(errorResponse);

      await sut.updateUserById(req, res);
    });
  });
});
