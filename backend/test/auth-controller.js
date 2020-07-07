const expect = require('chai').expect
const sinon = require('sinon')

const User = require('../models/user')
const AuthController = require('../controllers/auth')

describe('Auth controller', function() {
    describe('Login', function() {
        it('should throw an error code 500 if the access to the database failed', function(done) {
            sinon.stub(User, 'findOne')
            User.findOne.throws()

            const req = {
                body: {
                    email: 'test@test.com',
                    password: 'tester'
                }
            }

            AuthController.login(req, {}, () => {}).then(result => {
                expect(result).to.be.an('error')
                expect(result).to.have.property('statusCode', 500)
                done()
            }).catch(done)

            User.findOne.restore()
        })
    })
})