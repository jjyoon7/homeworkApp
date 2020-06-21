const express = require('express')
const path = require('path')

const bodyParser = require('body-parser')
const feedRoutes = require('./routes/feed')
const authRoutes = require('./routes/auth')

const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')

const PORT = 5000 || process.env.PORT

const app = express()

const multer = require('multer')
const { createBrotliCompress } = require('zlib')

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(multer({
    storage: fileStorage,
    fileFilter: fileFilter
}).single('image'))

app.use('/images', express.static(path.join(__dirname, 'images')))

require('dotenv').config()

app.use(cors({
    allowedHeaders: ['Content-Type', 'Authorization']
}))

const uri = process.env.ATLAS_URI

app.use(morgan('dev'))

app.use('/feed', feedRoutes)
app.use('/auth', authRoutes)

app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500
    const message = error.message
    const data = error.data
    res.status(status).json({ message: message, data: data})
})

mongoose.connect(uri, {
                        useNewUrlParser: true,
                        useCreateIndex: true,
                        useUnifiedTopology: true,
                        useFindAndModify: true
                        })
        .then(result => {
            const server = app.listen(PORT)
            const io = require('socket.io')(server)
            io.on('connection', socket => {
                console.log('Client connected')
            })
        })
        .catch(err => console.log(err))

const connection = mongoose.connection
connection.once('open', () => {
    console.log(`server is running on port ${PORT}`)
    console.log('mongoDB database connection established successfully.')
})

module.exports = app