const express = require("express");

const router =  express.Router();
const sendMessage = require("../controller/messageControllers")
const allMessages = require("../controller/messageControllers")
// app.post('/',sendMessage);
// app.get('/:chatId',sendMessage)

router.route('/:chatId').post(sendMessage)
router.route('/:chatId').get(allMessages)

module.exports=router;