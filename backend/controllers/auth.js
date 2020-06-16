const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const { load } = require('dotenv/types')

exports.signup = (req, res, next) => {
    const errors = validationResult(req)
    console.log('errors', errors)
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed.')
        error.statusCode = 422
        error.data = errors.array()
        throw error
    }

    const email = req.body.email
    const password = req.body.password
    const name = req.body.name

    bcrypt.hash(password, 12)
          .then(hashedPw => {
              const user = new User({
                  email: email,
                  password: hashedPw,
                  name: name
              })
              return user.save()
          })
          .then(result => {
              res.status(201).json({
                  message: 'New user is created.',
                  userId: result._id
              })
          })
          .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500
            }
            next(err)
          })
}

exports.login = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    let loadedUser

    User.findOne({ email: email })
        .then(user => {
            if(!user) {
                const error = new Error('User with this email does not exists.')
                //401 status code means lack validation / unauthorized
                error.statusCode = 401
                throw error
            }
            loadedUser = user
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500
            }
            next(err)
        })
}