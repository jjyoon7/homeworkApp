const express = require('express')

const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')

const app = express()

const morgan = require('morgan')
const cors = require('cors')

const PORT = 5000 || process.env.PORT

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

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
)

const helmet = require('helmet')

const feedRoutes = require('./routes/feed')
const authRoutes = require('./routes/auth')

app.use(helmet())

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

app.use(morgan('combined', { stream: accessLogStream }))

app.use('/feed', feedRoutes)
app.use('/auth', authRoutes)

app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500
    const message = error.message
    const data = error.data
    res.status(status).json({ message: message, data: data})
})

const uri = process.env.ATLAS_URI

mongoose.connect(uri, {
                        useNewUrlParser: true,
                        useCreateIndex: true,
                        useUnifiedTopology: true,
                        useFindAndModify: true
                        })
        .then(result => {
            console.log(`server is running on port ${PORT}`)
            console.log('mongoDB database connection established successfully.')
            const server = app.listen(PORT)
            const io = require('./socket').init(server)
            io.on('connection', socket => {
                console.log('Client connected')
            })
        })
        .catch(err => console.log(err))