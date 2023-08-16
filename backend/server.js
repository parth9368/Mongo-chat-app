const express = require("express");
const dotenv = require("dotenv");
// const { chats } = require("./data/data");
require("./config/db");
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")

const app = express();
dotenv.config();

app.get('/',(req,res) => {
    res.send("API is running Successfully")
});

app.use('/api/user', userRoutes)

app.use('/api/chat', chatRoutes);

app.use('/api/message', messageRoutes);

// app.use(notFound);
// app.use(errorHandler);

const PORT  = process.env.PORT || 8000;

const server = app.listen(8000, console.log(`Server started on PORT ${PORT}`));

const io = require("server.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
})

io.on('connect', function(socket){
    console.log('User Connected to socket.io');

    socket.on('setup', (userData) =>{
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit("connected")
    })

    socket.on('join chat', (room) => {
        socket.join(room);
     console.log("User Joined Room" + room);
    })

    socket.on('typing', (room) => socket.in(room).emit("typing"));
    socket.on('stop typing', (room) => socket.in(room).emit("stop typing"));

    socket.on("new message",(newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if(!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if(user._id == newMessageReceived.sender._id) return;

            socket.in(user_id).emit("message received", newMessageReceived)
        })

    })
    socket.off("setup", ()=>{
        console.log("USER DISCONNECTED");
        socket.leave(userData._id)
    })
})