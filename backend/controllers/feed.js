const validationResult = require('express-validator')
const Post = require('../models/post')

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{ 
            _id: '1',
            title: 'First secret', 
            content: 'This is the secret diary to share!', 
            imageUrl: 'images/bg.png',
            creator: {
                name: 'Jay'
            },
            createdAt: new Date()
        }]
    })
}

exports.createPost = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, user input data is incorrect.')
        error.statusCode = 422
        throw error
    }
    console.log('POST')
    const title = req.body.title
    const content = req.body.content

    const post = new Post({
        title: title, 
        imageUrl: 'images/bg.png',
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