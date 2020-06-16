const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const User = require('../models/user')
const authController = require('../controllers/auth')

router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                       .then(userData => {
                           if(userData) {
                               return Promise.reject('Email address already exists.')
                           }
                       })
        })
        .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().not().isEmpty()
], authController.signup)

modeul.exports = router