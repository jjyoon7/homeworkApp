const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const User = require('../models/user')

router.put('/auth', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .custom((value, {req}) => {
            return User.findOne({ email: value })
                       .then(userData => {
                           if(userData) {
                               return Promise.reject('Email address already exists.')
                           }
                       })
        })
        .normalizeEmail(),
])

modeul.exports = router