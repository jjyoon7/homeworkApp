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
        return res.status(422).json({
            message: 'Validation failed, user input data is incorrect.',
            errors: errors.array()
        })
    }
    console.log('POST')
    const title = req.body.title
    const content = req.body.content

    const post = new Post({
        title: title, 
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
            console.log(err)
        })

    res.status(201).json({
        message: 'Secret diary post created successfully',
        post: { _id: new Date().toISOString(), 
                createdAt: new Date()
            }
    })
}