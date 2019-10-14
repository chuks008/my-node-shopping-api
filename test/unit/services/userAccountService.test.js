const sinon = require('sinon');
const assert = require('assert');
const { expect } = require('chai');
const error = require('../../../src/error');
const { User } = require('../../../src/models').models;
const sut = require('../../../src/services/users/userAccountService')(
  User,
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
      const userId = 12;
      const foundUser = {
        id: 1,
        username: 'username002',
        email: 'username002@mail.com',
        address: '123 Address',
      };

      sinon.stub(User, 'findOne').resolves(foundUser);
      const successResponse = await sut.findUserById(userId);

      console.log('Testing successResponse', successResponse);

      expect(successResponse.user).to.have.keys(
        'user_id',
        'email',
        'username',
      );
      expect(successResponse.error).to.be.false;
    });
  });
});
