const expect = require('chai').expect

const authMiddleware = require('../middleware/is-auth')

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

    expect(authMiddleware(req, {}, () => {})).to.throw('Header: Authorization failed.')
})