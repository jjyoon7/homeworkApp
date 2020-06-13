const express = require('express')
const bodyParser = require('body-parser')
const feedRoutes = require('./routes/feed')

const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')

const app = express()


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


require('dotenv').config()


app.use(cors())

const uri = process.env.ATLAS_URI

app.use(morgan('dev'))



app.use('/feed', feedRoutes)

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