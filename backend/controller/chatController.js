const asyncHandler = require("express-async-handler")
const User = require("../models/userModel");
const Chat = require("../models/chatModels")


const accessChat = asyncHandler(async (req,res) =>{
    const { userId } = req.body;

    if(!userId) {
        console.log("UserId params not sent with request")
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}},
        ]
    }).populate("latestMessage");

    isChat = await User.populate(isChat,{
        path: "latestMessage.sender",
        select: "name pic email"
    })

    if(isChat.length > 0){
        res.send(isChat[0]);
    } else {
        var chatData ={
            chatName:"sender",
            isGroupChat:false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            
            const fullChat = await Chat.findOne(createdChat).populate("users", "-password");
            res.status(200).send(fullChat);
        } catch (error) {
            res.status(400).send(error);
        }
    }
});




const fetchChat = asyncHandler(async (req,res) =>{

    try {
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) =>{
            results = await User.populate(isChat, {
                path:"latestMessage.sender",
                select: "name pic email"
            });
            res.status(200).send(results);
        })

    } catch (error) {
        
    }

});

module.exports = { accessChat, fetchChat }