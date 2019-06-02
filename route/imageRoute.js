const express = require('express');

const router = express.Router();

const ImageCtrl = require('../controllers/images');
const AuthHelper = require('../Helpers/authHelper');

router.get('/set-default-image/:imgId/:imgVersion', AuthHelper.VerifyToken, ImageCtrl.setDefaultImage);

router.post('/upload-image', AuthHelper.VerifyToken, ImageCtrl.AddImage);


module.exports = router;