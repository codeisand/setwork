const express = require('express');

const router = express.Router();

const MessageCtrl = require('../controllers/message');
const AuthHelper = require('../Helpers/authHelper');


router.get('/chat-messages/:sender_Id/:receiver_Id', AuthHelper.VerifyToken, MessageCtrl.getMsg);
router.get('/receiver-messages/:sender/:receiver', AuthHelper.VerifyToken, MessageCtrl.MarkReceiverMsg);

router.get('/mark-all-msgs', AuthHelper.VerifyToken, MessageCtrl.MarkAllMsgs);
router.post('/chat-messages/:sender_Id/:receiver_Id', AuthHelper.VerifyToken, MessageCtrl.sendMsg);



module.exports = router;