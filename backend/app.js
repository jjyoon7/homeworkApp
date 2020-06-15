const express = require('express')
const path = require('path')

const bodyParser = require('body-parser')
const feedRoutes = require('./routes/feed')

const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')

const app = express()


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/images', express.static(path.join(__dirname, 'images')))

require('dotenv').config()

app.use(cors())

const uri = process.env.ATLAS_URI

app.use(morgan('dev'))

app.use('/feed', feedRoutes)

app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500
    const message = error.message
    res.status(status).json({ message: message})
})

mongoose.connect(uri, {
                        useNewUrlParser: true,
                        useCreateIndex: true,
                        useUnifiedTopology: true
                        })

const connection = mongoose.connection
connection.once('open', () => {
    console.log('mongoDB database connection established successfully.')
})

module.exports = app