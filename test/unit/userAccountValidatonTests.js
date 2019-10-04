const sinon = require('sinon');
const validation = require('../../src/middleware/validation');

describe('Validation Test Suite', () => {
  let res;
  let status;
  let json;
  let nextSpy;
  const req = {};

  beforeEach(() => {
    status = sinon.stub();
    json = sinon.spy();
    res = { json, status };
    status.returns(res);
    req.body = {};

    nextSpy = sinon.spy();
  });

  describe('#login request parameters', () => {
    it('should call next() when login field validation succeeds', () => {
      req.body = {
        username: 'username007',
        password: 'password',
      };
      validation.validateLogin(req, res, nextSpy);

      sinon.assert.calledOnce(nextSpy);
      sinon.assert.notCalled(res.json);
      sinon.assert.notCalled(res.status);
    });

    it('should return missing parameter error when a request value is missing', () => {
      // Arrange

      req.body = {
        username: '',
        password: 'password',
      };

      const responseData = {
        message: 'username value missing from the input values',
      };

      // Act
      validation.validateLogin(req, res, nextSpy);

      // Assert
      sinon.assert.notCalled(nextSpy);
      sinon.assert.calledWith(res.status, 403);
      sinon.assert.calledWith(res.json, responseData);
    });

    it('should return missing parameter error on empty request body', () => {
      const responseData = {
        message: 'username, password missing from the request',
      };

      validation.validateLogin(req, res, nextSpy);

      sinon.assert.notCalled(nextSpy);
      sinon.assert.calledWith(res.status, 403);
      sinon.assert.calledWith(res.json, responseData);
    });

    it('should return missing parameter error when a request field is missing', () => {
      // Arrange
      req.body = {
        username: 'username007',
      };

      const responseData = {
        message: 'password missing from the input values',
      };
      // Act
      validation.validateLogin(req, res, nextSpy);

      // Assert
      sinon.assert.notCalled(nextSpy);
      sinon.assert.calledWith(res.status, 403);
      sinon.assert.calledWith(res.json, responseData);
    });
  });

  describe('#registration request parameters', () => {
    it('Should return a missing parameters error on missing request field values', () => {
      req.body = {
        username: '',
        email: '',
        address: '',
        password: '',
      };

      const responseData = {
        message:
          'username value, email value, password value missing from the input values',
      };
      // Act
      validation.validateRegistration(req, res, nextSpy);

      // Assert
      sinon.assert.notCalled(nextSpy);
      sinon.assert.calledWith(res.status, 403);
      sinon.assert.calledWith(res.json, responseData);
    });

    it('should call next() when registration field validation succeeds', () => {
      req.body = {
        email: 'email@username.com',
        username: 'username007',
        password: 'password',
        address: '',
      };

      validation.validateRegistration(req, res, nextSpy);
      sinon.assert.calledOnce(nextSpy);
      sinon.assert.notCalled(res.json);
      sinon.assert.notCalled(res.status);
    });

    it('should return missing parameter error on empty request body', () => {
      const responseData = {
        message: 'username, email, password missing from the request',
      };

      validation.validateRegistration(req, res, nextSpy);

      sinon.assert.notCalled(nextSpy);
      sinon.assert.calledWith(res.status, 403);
      sinon.assert.calledWith(res.json, responseData);
    });
  });
});
