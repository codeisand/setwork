const express = require('express');
const router = express.Router();

const PostCtrl = require('../controllers/posts');
const AuthHelper = require('../Helpers/authHelper')



router.get('/posts', AuthHelper.VerifyToken, PostCtrl.getAllPosts);
router.get('/post/:id', AuthHelper.VerifyToken, PostCtrl.getPost);
router.post('/post/add-post', AuthHelper.VerifyToken, PostCtrl.AddPost);
router.post('/post/add-like', AuthHelper.VerifyToken, PostCtrl.AddLike);
router.post('/post/add-comment', AuthHelper.VerifyToken, PostCtrl.AddComment);

module.exports = router;