const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {

    const token = req.get('Authorization').split(' ')[1]
    let decodedToken
    try {
        decodedToken = jwt.verify(token, 'privatekeytogenerateatokenstring')
    } catch (err) {
        err.statusCode = 500
        throw err
    }
    if(!decodedtoken) {
        const error = new Error('Failed authentication.')
        error.statusCode = 401
        throw error
    }
    req.userId = decodedToken.userId
    next()
}