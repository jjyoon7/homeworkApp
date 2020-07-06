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

    authMiddleware(req)
})