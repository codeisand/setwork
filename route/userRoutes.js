const express = require('express');

const router = express.Router();

const UserCtrl = require('../controllers/users');
const AuthHelper = require('../Helpers/authHelper');

router.get('/users', AuthHelper.VerifyToken, UserCtrl.getAllUsers);
router.get('/user/:id', AuthHelper.VerifyToken, UserCtrl.getUser);
router.get('/username/:username', AuthHelper.VerifyToken, UserCtrl.getUserName);


router.post('/user/view-profile', AuthHelper.VerifyToken, UserCtrl.ProfileView);
router.post('/change-pass', AuthHelper.VerifyToken, UserCtrl.ChangePass);

module.exports = router;