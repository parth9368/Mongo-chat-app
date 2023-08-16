const express = require("express");
const { accessChat, fetchChat } = require("../controller/chatController")

const app=  express();

app.post('/',accessChat);
app.get('/',fetchChat);

module.exports=app;