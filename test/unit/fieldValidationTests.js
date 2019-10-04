const { assert } = require('chai');
const fieldValidaton = require('../../src/util/validation/fieldValidation');

describe('Field validation test suite', () => {
  describe('#isRequestEmpty', () => {
    const req = {
      body: {},
    };

    beforeEach(() => {
      req.body = {};
    });
    it('should return true when the request is empty', () => {
      assert.isTrue(fieldValidaton.isRequestEmpty(req.body));
    });

    it('should return false when the request contains keys without values', () => {
      req.body = {
        request_param1: '',
        request_param2: '',
      };

      assert.isFalse(fieldValidaton.isRequestEmpty(req.body));
    });

    it('should return false when the request contains keys with values', () => {
      req.body = {
        request_param1: 'a',
        request_param2: 'b',
      };

      assert.isFalse(fieldValidaton.isRequestEmpty(req.body));
    });
  });

  describe('#validationInputs', () => {
    it('should return error count of 1 and missing value error message on missing input value', () => {
      const inputs = ['username', 'email'];
      const requestBody = {
        username: '',
        email: 'email@ya.co',
      };

      const errorMessage =
        'username value missing from the input values';

      const validationResult = fieldValidaton.validateInputs(
        requestBody,
        inputs,
      );
      assert.equal(validationResult.errorCount, 1);
      assert.equal(validationResult.message, errorMessage);
    });

    it('should return error count of 1 and missing field error message on missing input field', () => {
      const inputs = ['username', 'email'];
      const requestBody = {
        email: 'email@ya.co',
      };

      const errorMessage = 'username missing from the input values';

      const validationResult = fieldValidaton.validateInputs(
        requestBody,
        inputs,
      );
      assert.equal(validationResult.errorCount, 1);
      assert.equal(validationResult.message, errorMessage);
    });
  });
});
