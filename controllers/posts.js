const Joi = require('@hapi/joi');
const HttpStatus = require('http-status-codes');
const Post = require('../models/postModels');
const User = require('../models/userModels');
const cloudinary = require('cloudinary');
const moment = require('moment');

cloudinary.config({
    cloud_name:'codeisand',
    api_key: '455284225575459',
    api_secret: 'jbnLLI5qi3F9o66BRBcWry-2zXo'
})

module.exports = {
    AddPost(req, res) {
        const schema = Joi.object().keys({
            post: Joi.string().required()
            // image: Joi.string().optional()
        });

        const bodyPost ={
            post: req.body.post
        }
        const { error } = Joi.validate(bodyPost, schema);

        if (error && error.details) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                msg: error.details
            });
        }


        const body = {
            user: req.user._id,
            username: req.user.username,
            post: req.body.post,
            created: new Date()
        };

        if(req.body.post && !req.body.image){
            Post.create(body).then( async (post) => {
                await User.update({
                    _id: req.user._id
                },{
                  $push: {posts: {
                      postId: post._id,
                      post: req.body.post,
                      created: new Date()
                  }}  
                });
                res.status(HttpStatus.OK).json({message: 'Post created', post });
                console.log(post);
            }).catch((err) => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
            })
        }


        if(req.body.post && req.body.image){
            cloudinary.uploader.upload(req.body.image, async(result) => {
                const reqBody = {
                    user: req.user._id,
                    username: req.user.username,
                    post: req.body.post,
                    imgId: result.public_id,
                    imgVersion: result.version,
                    created: new Date()
                }
                Post.create(reqBody).then( async (post) => {
                    await User.update({
                        _id: req.user._id
                    },{
                      $push: {posts: {
                          postId: post._id,
                          post: req.body.post,
                          created: new Date()
                      }}  
                    });
                    res.status(HttpStatus.OK).json({message: 'Post created', post });
                    console.log(post);
                }).catch((err) => {
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
                })
            })
        }

       
    },


    async getAllPosts(req, res){
        try{

            // const today = moment.startOf('day');
            // const tomorrow = moment(today).add(1, 'days');

            const posts = await Post.find({}).populate('user').sort({created: -1});

            const top = await Post.find({totalLikes: {$gte: 2}}).populate('user').sort({created: -1});

            return res.status(HttpStatus.OK ).json({message: 'All posts', posts, top})
        } catch(err){
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occuered'})
        }
    },

  async AddLike(req,res){
        const postId = req.body._id;
       await Post.update({
            _id: postId,
            'likes.username': {$ne: req.user.username}
        }, {
            $push: {
                likes: {
                    username : req.user.username
                }
            },
            $inc: { totalLikes: 1},

        }).then(() => {
            res.status(HttpStatus.OK).json({message: 'You liked the post'});
        }).catch((err) => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occuered'});
        });
    },


    async AddComment(req,res){
        console.log(req.user.username);
        const postId = req.body.postId;
        await Post.update({
             _id: postId
         }, {
             $push: {
                comments: {
                    userId: req.user._id,
                    username: req.user.username,
                    comment: req.body.comment,
                    createdAt: new Date()
                 }
             }
            
         }).then(() => {
             res.status(HttpStatus.OK).json({message: 'Comment added to the post'});
         }).catch((err) => {
             res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occuered'});
         });
    },

    async getPost(req,res){
        await Post.findOne({_id: req.params.id}).populate('user').populate('comment.userId').then((post) => {
            res.status(HttpStatus.OK).json({message: 'Post found', post});
        }).catch((err) => {
            res.status(HttpStatus.NOT_FOUND).json({message: 'Post not found', post});
        });
    }



};