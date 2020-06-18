const fs = require('fs')
const path = require('path')
const { validationResult } = require('express-validator')
const Post = require('../models/post')
const User = require('../models/user')
const user = require('../models/user')


exports.getPosts = async (req, res, next) => {
    const currentPage = req.query.page
    const perPage = 2

    try {
        const totalItems = await Post.find().countDocuments()
        const posts = await Post.find()
                           .skip((currentPage - 1) * perPage)
                           .limit(perPage)
            
        res.status(200).json({
            message: 'Posts fetched',
            posts: posts,
            totalItems: totalItems
        })
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    }
}

exports.createPost = async (req, res, next) => {
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
        creator: req.userId
    })

    try {
        const post = await post.save()
        const user = await User.findById(req.userId)
    
        user.posts.push(post)
        await user.save()

        res.status(200).json({
            message: 'Post created succesfully',
            post: post,
            creator: { _id: user._id, name: user.name }
        })     
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    }
}

exports.getPost = async (req, res, next) => {
    const postId = req.params.postId
    
    try {
        const post = await Post.findById(postId)

        if(!post) {
            const error = new Error('Post not found')
            error.statusCode = 404
            throw error
        }

        res.status(200).json({
            message: 'Post fetched',
            post: post
        })
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    }
}

exports.updatePost = async (req, res, next) => {
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

    try {
        const post = await Post.findById(postId)

        if(!post) {
            const error = new Error('Post not found')
            error.statusCode = 404
            throw error
        }
        if(post.creator.toString() !== req.userId) {
            const error = new Error('Auauthorized user.')
            error.statusCode = 403
            throw error
        }
        if(imageUrl !== post.imageUrl) {
            deleteImageFile(post.imageUrl)
        }
        post.title = title
        post.content = content
        post.imageUrl = imageUrl
        
        await post.save()

        res.status(200).json({
            message: 'Post updated',
            post: result
        })
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    }
}

exports.deletePost = async (req, res, next) => {
    const postId = req.params.postId

    try {
        const post = await Post.findById(postId)
        
        if(!post) {
            const error = new Error('Post not found')
            error.statusCode = 404
            throw error
        }
        if(post.creator.toString() !== req.userId) {
            const error = new Error('Auauthorized user.')
            error.statusCode = 403
            throw error
        }
        deleteImageFile(post.imageUrl)
        await Post.findByIdAndRemove(postId)
        
        const user = await User.findById(req.userId)
        user.posts.pull(postId)
        await user.save()

        res.status(200).json({
            message: 'Post deleted.'
        })
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    }
}

const deleteImageFile = filePath => {
    filePath = path.join(__dirname, '..', filePath)
    fs.unlink(filePath, err => console.log(err))
}