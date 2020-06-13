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
    console.log('POST')
    const title = req.body.title
    const content = req.body.content
    res.status(201).json({
        message: 'Secret diary post created successfully',
        post: { _id: new Date().toISOString(), 
                title: title, 
                content: content,
                creator: { "name" : "Jay" },
                createdAt: new Date()
            }
    })
}