const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization')

    if(!authHeader) {
        const error = new Error('Header: Authorization failed.')
        error.statusCode = 401
        throw error
    }

    //split with space, and geting 2nd item in array
    //bcs what the header look like is 'Bearer + token'
    const token = authHeader.split(' ')[1]
    let decodedToken
    try {
        decodedToken = jwt.verify(token, 'privatekeytogenerateatokenstring')
    } catch (err) {
        err.statusCode = 500
        throw err
    }
    if(!decodedToken) {
        const error = new Error('Failed authentication.')
        error.statusCode = 401
        throw error
    }
    req.userId = decodedToken.userId
    next()
}