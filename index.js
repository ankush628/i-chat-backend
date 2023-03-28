const express = require("express");
const http = require("http");
const cors=require("cors");
const socketio = require('socket.io');

const PORT = process.env.PORT || 5000;
const router = require("./router");
const app=express();
const server = http.createServer(app);
const io=socketio(server);

const users= {};

io.on('connection', socket=>{
    // handling joining of a new user to let others know
    socket.on('new-user-joined', name=>{
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name);
    });

    // someone sending messages ,then broadcast to all
    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message: message,name: users[socket.id]});
    });

    // someone leaving the chat , let others know
    socket.on('disconnect',message=>{
        socket.broadcast.emit('leave',users[socket.id]);
        delete users[socket.id];
    });
});

app.use(router);
app.use(cors());

server.listen(PORT,()=>console.log(`Server has started on ${PORT}`));
