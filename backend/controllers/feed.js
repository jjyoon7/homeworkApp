const fs = require('fs')
const path = require('path')
const { validationResult } = require('express-validator')
const Post = require('../models/post')


exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page
    const perPage = 2
    let totalItems

    Post.find()
        .countDocuments
        .then(count  => {
            totalItems = count
            return Post.find()
        })
        .then(posts => {
            res.status(200).json({
                message: 'Posts fetched',
                posts: posts
            })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500
            }
            next(err)
        })
}

exports.createPost = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, user input data is incorrect.')
        error.statusCode = 422
        throw error
    }
    if(!req.file) {
        const error = new Error('No image provided.')
        error.statusCode = 422
        throw error
    }
    console.log('POST')
    const title = req.body.title
    const content = req.body.content
    const imageUrl = req.file.path

    const post = new Post({
        title: title, 
        imageUrl: imageUrl,
        content: content,
        creator: { name : 'Jay' }
    })

    post.save()
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: 'Post created succesfully',
                post: result
            })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500
            }
            next(err)
        })
}

exports.getPost = (req, res, next) => {
    const postId = req.params.postId
    Post.findById(postId)
        .then(post => {
            if(!post) {
                const error = new Error('Post not found')
                error.statusCode = 404
                throw error
            }
            res.status(200).json({
                message: 'Post fetched',
                post: post
            })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500
            }
            next(err)
        })
}

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, user input data is incorrect.')
        error.statusCode = 422
        throw error
    }

    const title = req.body.title
    const content = req.body.content
    let imageUrl = req.body.image

    if(req.file) {
        imageUrl = req.file.path
    }
    if(!imageUrl) {
        const error = new Error('No image data is picked')
        error.statusCode = 422
        throw error   
    }

    Post.findById(postId)
        .then(post => {
            if(!post) {
                const error = new Error('Post not found')
                error.statusCode = 404
                throw error
            }
            if(imageUrl !== post.imageUrl) {
                deleteImageFile(post.imageUrl)
            }
            post.title = title
            post.content = content
            post.imageUrl = imageUrl
            return post.save()
        })
        .then(result => {
            res.status(200).json({
                message: 'Post updated',
                post: result
            })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500
            }
            next(err)
        })
}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId
    Post.findById(postId)
        .then(post => {
            if(!post) {
                const error = new Error('Post not found')
                error.statusCode = 404
                throw error
            }
            deleteImageFile(post.imageUrl)
            return Post.findByIdAndRemove(postId)
        })
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: 'Post deleted.'
            })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500
            }
            next(err)
        })
}

const deleteImageFile = filePath => {
    filePath = path.join(__dirname, '..', filePath)
    fs.unlink(filePath, err => console.log(err))
}