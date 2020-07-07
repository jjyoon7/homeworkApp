const expect = require('chai').expect
const sinon = require('sinon')

const User = require('../models/user')
const AuthController = require('../controllers/auth')

const mongoose = require('mongoose')
const uri = process.env.ATLAS_TEST_URI

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

    describe('getUserStatus', function() {
        it('should send a response with valid user status for an existing user', function(done) {
            mongoose.connect(uri, {
                            useNewUrlParser: true,
                            useCreateIndex: true,
                            useUnifiedTopology: true,
                            useFindAndModify: true
                            })
            .then(result => {
                const user = new User({
                    email: 'test@test.com',
                    password: 'tes',
                    name: 'john',
                    posts: []
                })

                return user.save()
            })
            .catch(err => console.log(err))
                    })
            })
})