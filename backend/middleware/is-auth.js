const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const token = req.get('Authorization').split(' ')[1]
    let decodedtoken
    try {
        decodedToken = jwt.verify(token, 'privatekeytogenerateatokenstring')
    }
}