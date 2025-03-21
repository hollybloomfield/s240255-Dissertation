import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express()
const server = http.createServer(app)

const io = new Server(server,{
    cors: {
        origin: ["http://localhost:5173"]
    }
})

export function getReceiverSocketId(userId) {
    return userSocketMap[userId]
} //retrieves the socketId based on the userId passed in

//used to store online users
const userSocketMap = {};

io.on("connection",(socket) => {
    console.log("A user connected", socket.id)
    const userId = socket.handshake.query.userId
    if (userId) userSocketMap[userId] = socket.id

    //io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
    

    socket.on("disconnect", () =>{
        console.log("A user disconnected", socket.id)
        delete userSocketMap[userId] //remove userID from online user array
        io.emit("getOnlineUsers", Object.keys(userSocketMap)) //send the updated event to all connected clients

    })
})

export {io, app, server};