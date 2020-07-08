const expect = require('chai').expect
const sinon = require('sinon')

const User = require('../models/user')
const AuthController = require('../controllers/auth')

const mongoose = require('mongoose')
require('dotenv').config()
const uri = process.env.ATLAS_TEST_URI


describe('Auth controller', function() {

    before(function(done) {

    })

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
                    password: 'test',
                    name: 'john',
                    posts: [],
                    _id: '5c0f66b979af55031b34729a'
                })

                return user.save()
            })
            .then(() => {
                const req = {
                    userId: '5c0f66b979af55031b34729a'
                }

                //mimik this 'res.status(200).json({status: user.status})'
                const res = {
                    statusCode: 500,
                    userStatus: null,
                    status: function(code) {
                        this.statusCode = code
                        return this
                    },
                    json: function(data) {
                        this.userStatus = data.status
                    }
                }

                AuthController.getUserStatus(req, res, () => {}).then(() => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.userStatus).to.be.equal('New user')
                    User.deleteMany({})
                        .then(() => {
                            return mongoose.disconnect()
                        }).then(()=>{
                            done()
                        })
                }).catch(done)
            })
            .catch(err => console.log(err))
                    })
    })

    after(function(done) {
        
    })
})