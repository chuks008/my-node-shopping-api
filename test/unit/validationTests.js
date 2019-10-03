const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { mockRes } = require('sinon-express-mock');
const validation = require('../../src/middleware/validation');

const {expect} = chai;

chai.use(sinonChai);

describe('Validation Test Suite', () => {
    describe('When validating login parameters', () => {

        it('should return missing parameter error when a request field is missing', () => {
            // Arrange
            const req = { // request object
                body: {
                    username: '',
                    password: '',
                }
            };

            const responseData = {
                message: "username, password missing from the input values"
            };

            const nextSpy = sinon.spy();
            const res = mockRes();

            // Act
            validation.validateLogin(req, res, nextSpy);

            // Assert
            expect(nextSpy.calledOnce).to.be.false;
            expect(res.status).to.be.calledWith(403);
            expect(res.json).to.be.calledWith(responseData);
            
        });

        it('should call next() when validation succeeds', () => {
            const req = { // request object
                body: {
                    username: 'username007',
                    password: 'password',
                }
            };

            const nextSpy = sinon.spy();
            const res = mockRes();

            validation.validateLogin(req, res, nextSpy);
            expect(nextSpy.calledOnce).to.be.true;
            expect(res.json).to.not.be.called;
            expect(res.status).to.not.be.called;
            
        });

        it('should return missing parameter error on empty request body', () => {
            const req = {
                body: {}
            };

            const nextSpy = sinon.spy();
            const res = mockRes();

            const responseData = {
                message: "username, password missing from the request"
            };

            validation.validateLogin(req, res, nextSpy);

            expect(res.status).to.be.calledWith(403);
            expect(res.json).to.be.calledWith(responseData)
            expect(nextSpy.notCalled).to.be.true;
        });
    });

    describe('When validating registration request', () => {
        it('Should return a missing parameters error on incomplete request body', () => {
            
        })
    });
    
})