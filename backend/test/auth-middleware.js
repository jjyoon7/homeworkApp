const expect = require('chai').expect
const jwt = require('jsonwebtoken')
const sinon = require('sinon')

const authMiddleware = require('../middleware/is-auth')

describe('Auth middleware', function() {
    describe('Auth Header', function() {
        it('should throw an error if there is no authorization header.', function() {
            //scenario is to check if the req object has authorization header
        
            //const authHeader = req.get('Authorization')
            //if above line returns false, it should throw an error.
            //that is why dummy 'req' object has an method 'get' that returns null
        
            const req = {
                get: function() {
                    return null
                }
            }
        
            //authMiddleware takes 3 args (req, res, next)
            //req, which is what we are testing and created a dummy data for.
            //{} is res
            //empty arrow function is next()
        
            //The bind() method creates a new function that, 
            //when called, has its this keyword set to the provided value, 
            //with a given sequence of arguments preceding any provided when the new function is called.
            expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Header: Authorization failed.')
        })
    })

    describe('Token Existence', function() {
        it('should throw an error if there is only one string', function() {
            const req= {
                get: function() {
                    return 'string'
                }
            }
        
            expect(authMiddleware.bind(this, req, {}, () => {})).to.throw()
        })
    })

    describe('userId existence', function() {
        it('should get a userId after decoding the token', function() {
            const req = {
                get: function() {
                    return 'Bearer askdlfjeljtlwejlwejtlwjet'
                }
            }

            sinon.stub(jwt, 'verify')
            
            jwt.verify = function() {
                return { userId: 'abc' }
            }

            authMiddleware(req, {}, () => {})
            expect(req).to.have.property('userId')
        })
    })
})