const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


exports.signup = async (req, res, next) => {
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

    try {
        const hashedPw = await bcrypt.hash(password, 12)
        const user = await new User({   email: email,
                                        password: hashedPw,
                                        name: name
                                    })
    
        await user.save()

        res.status(201).json({
            message: 'New user is created.',
            userId: result._id
        })

    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    }
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
            return bcrypt.compare(password, user.password)
        })
        .then(isEqual => {
            if(!isEqual) {
                const error = new Error('Wrong password')
                error.statusCode = 401
                throw error
            }
            const token = jwt.sign(
                    {
                        email: loadedUser.email,
                        userId: loadedUser._id.toString()
                    },
                    'privatekeytogenerateatokenstring',
                    { expiresIn: '1h' }
                )
            
            res.status(200).json({
                token: token,
                userId: loadedUser._id.toString()
            })

        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500
            }
            next(err)
        })
}

exports.getUserStatus = (req, res, next) => {
    User.findById(req.userId)
        .then(user => {
            if(!user) {
                const error = new Error('No user found.')
                error.statusCode = 404
                throw error
            }
            res.status(200).json({
                status: user.status
            })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500
            }
            next(err)
        })
}

exports.updateUserStatus = (req, res, next) => {
    const newStatus = req.body.status

    User.findById(req.userId)
        .then(user => {
            if(!user) {
                const error = new Error('No user found.')
                error.statusCode = 404
                throw error
            }
            user.status = newStatus
            return user.save()
        })
        .then(result => {
            res.status(200).json({
                message: 'User status updated.'
            })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500
            }
            next(err)
        })
}