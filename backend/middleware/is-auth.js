const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {

    const token = req.get('Authorization').split(' ')[1]
    let decodedtoken
    try {
        decodedToken = jwt.verify(token, 'privatekeytogenerateatokenstring')
    } catch (err) {
        err.statusCode = 500
        throw err
    }
}