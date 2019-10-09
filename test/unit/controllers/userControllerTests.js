const sinon = require('sinon');
const assert = require('assert');
const userService = require('../../../src/services/users/userAccountService')();
const sut = require('../../../src/controllers/users')(userService);

describe('User Controller tests', () => {
  let res;
  let status;
  let json;
  const req = {};

  beforeEach(() => {
    status = sinon.stub();
    json = sinon.spy();
    res = { json, status };
    status.returns(res);
    req.body = {};
  });

  describe('registration method tests', () => {
    it('should call user service registration with correct parameters', () => {
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

      sinon.stub(userService, 'registerUser').resolves('ok');

      sut.registerUser(req, res);

      sinon.assert.calledWith(
        userService.registerUser,
        username,
        email,
        password,
        address,
      );
    });
  });
});
