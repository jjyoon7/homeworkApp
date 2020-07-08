const expect = require('chai').expect

const mongoose = require('mongoose')
const User = require('../models/user')

const FeedController = require('../controllers/feed')

require('dotenv').config()
const uri = process.env.ATLAS_TEST_URI

describe('Feed controller', function() {
    before(function(done) {
        mongoose.connect(uri, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: true
        })
        .then(result => {
            const user = new User({
                email: 'test@test.com',
                password: 'test',
                name: 'john',
                posts: [],
                _id: '5c0f66b979af55031b34739a'
            })
            return user.save()
            })
        .then(() => {
            done()
        })
    })

    describe('createPost', function() {
        it('should be able create a post and that post should save in posts array of the user who created', function(done) {
            const req = {
                body: {
                    title: 'post title',
                    content: 'post content'
                },
                file: {
                    path: 'thisisthepath'
                },
                userId: '5c0f66b979af55031b34739a'
            }

            const res = {
                status: function() {
                    return this
                },
                json: function() {}
            }
              
            FeedController.createPost(req, res, () => {}).then(savedUser => {
                expect(savedUser).to.have.property('posts')
                expect(savedUser.posts).to.have.length(1)
                done()
            }).catch(err => {
                console.log(err)
            })
        })
    })

    after(function(done) {
        User.deleteMany({})
        .then(() => {
            return mongoose.disconnect()
        }).then(()=>{
            done()
        })
    })
})