const User = require('../models/user')

exports.signup = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    const name = req.body.name
}