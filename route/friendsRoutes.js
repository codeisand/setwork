const express = require('express');

const router = express.Router();

const FriendCtrl = require('../controllers/friends');
const AuthHelper = require('../Helpers/authHelper');

router.post('/follow-user', AuthHelper.VerifyToken, FriendCtrl.followUser);
router.post('/unfollow-user', AuthHelper.VerifyToken, FriendCtrl.unfollowUser);

router.post('/mark/:id', AuthHelper.VerifyToken, FriendCtrl.MarkNoti);

router.post('/mark-all', AuthHelper.VerifyToken, FriendCtrl.MarkNotiAll);


module.exports = router;