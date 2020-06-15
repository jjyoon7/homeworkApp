const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    content: { type: String, required: true },
    //later connected to User model
    creator: { type: Object, required: String }
})

