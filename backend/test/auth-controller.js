const expect = require('chai').expect
const sinon = require('sinon')

const User = require('../models/user')
const AuthController = require('../controllers/auth')

describe('Auth controller', function() {
    describe('Login', function() {
        it('should throw an error code 500 if the access to the database failed', function() {
            sinon.stub(User, 'findOne')
            User.findOne.throws()
        })
    })
})