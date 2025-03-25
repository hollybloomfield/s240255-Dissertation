import Chats from "../models/chats.model.js"
import Message from "../models/message.model.js";
import User from "../models/user.model.js"
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js";



export const getChatUsers = async (req,res) => {
    try {
     
        const loggedInUserId = req.user._id
      
        const chats = await Chats.find({ //finds where logged in user id is equal to user1 or user2
            $or: [{
                user1: loggedInUserId
            },{
                user2: loggedInUserId
            }]
        })
       
        const chatsData = chats.map(chat => {
            const otherUserId = chat.user1.equals(loggedInUserId) ? chat.user2 : chat.user1 
            //return user2 if user1 equal to loggedinuserid, if not return user1
            return {
                otherUserId,
                lastMessage: chat.lastMessage,
                updatedAt: chat.updatedAt, //return the otherUserId along with the lastMessage and UpdatedAt
            }
        })

        const chatUsers = await User.find({_id:{$in: chatsData.map(data => data.otherUserId)}}).select("-password") 
        //find all users in chatuserIds and return everything except password
        
        const result = chatUsers.map(user => {
            const chatData = chatsData.find(data => data.otherUserId.equals(user._id))

            return {
                ...user.toObject(),
                lastMessage: chatData.lastMessage,
                chatUpdatedAt: chatData.updatedAt,
            } //combine both user details from user collection and lastMessage/updatedAt from chat collection
        })

        res.status(200).json(result)
    } catch (error) {
        console.log("Error in getChatUsers: ", error.message)
        res.status(500).json({error: "Internal server error"})
    }  
}; //gets chats matching current userId and returns the other userId

export const getMessages = async (req,res) => {
    try {
        const {id:userToChatId} = req.params
        const myId = req.user._id

        const messages = await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId: myId}
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message)
        res.status(500).json({ error: "Internal server error"})
    }
}; //gets messages between current user and another user

export const sendMessage = async (req,res) => {
    try {
        const {text, image} = req.body
        const {id: receiverId} = req.params
        const senderId = req.user._id

        let imageUrl
        if (image) {
            //Upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        await newMessage.save()

        let chat = await Chats.findOne(
            {
                $or: [
                    { user1: senderId, user2: receiverId },  // Check if the chat exists
                    { user1: receiverId, user2: senderId },
                ],
            },
        )

        let isNewChat = false

        if (!chat) { //if chat doesn't exist, create a new one and insert text into lastMessage
            isNewChat = true //indicates that the chat is new for newChat emit
            chat = new Chats({
                user1: senderId,
                user2: receiverId,
                lastMessage: text || "An Image was shared",
                
            });
            await chat.save();

        } else { //if chat does exist, update and add text to last message
           chat.lastMessage = text || "An Image was shared";
        await chat.save(); 
        }

        const receiverSocketId = getReceiverSocketId(receiverId) //using receiver id passed in params to get their socketId
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage) //only broadcasting it to receiverId
            io.to(receiverSocketId).emit("newNotification", newMessage)

            const senderChatUser = {
                                ...req.user.toObject(),
                                lastMessage: chat.lastMessage,
                                chatUpdatedAt: chat.updatedAt,
                            }; //combining user collection and chats collection
            if (isNewChat){ 
                io.to(receiverSocketId).emit("newChat", senderChatUser)  //emit if new Chat  
            } else {
                io.to(receiverSocketId).emit("updateChats", senderChatUser) //emit if new Message
            }
        } //if user is online send the event in real-time

        res.status(201).json(newMessage)


    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message)
        res.status(500).json({error: "Internal server error"})
    }
}; //adds messages to the message collection 

export const blockUser = async (req,res) => {
    try {
     const loggedInUserId = req.user._id
        const {id:userToBlock} = req.params

        const updatedBlockedUsers = await User.findByIdAndUpdate(
            loggedInUserId,
            { $addToSet: { blockedUsers: userToBlock } }, //prevents duplicates
            { new: true } 
        )

        const receiverSocketId = getReceiverSocketId(userToBlock)

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userBlocked", updatedBlockedUsers)
        } //emits the current users blocked user list to the other user

        res.status(200).json(updatedBlockedUsers.blockedUsers);

    } catch (error) {
            console.log("Error in blockUser controller: ", error.message)
                res.status(500).json({ error: "Internal server error"})
    }
}; //adds user to blocked user list

export const unblockUser = async (req,res) => {
    try {
        const loggedInUserId = req.user._id
        const {id:userToUnblock} = req.params

        const updatedBlockedUsers = await User.findByIdAndUpdate(
                    loggedInUserId,
                    { $pull: { blockedUsers: userToUnblock } }, //removes Id from array
                    { new: true } 
        )
        
        const receiverSocketId = getReceiverSocketId(userToUnblock)
        
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userUnblocked", updatedBlockedUsers)
        } //emits updated blocked user list to other user

        res.status(200).json(updatedBlockedUsers.blockedUsers);
    } catch (error) {
        console.log("Error in unblockUser controller: ", error.message)
        res.status(500).json({ error: "Internal server error"})
    }
}; //removes user to blocked user list

export const getBlockedUsers = async (req,res) => {
    try {
        const loggedInUserId = req.user._id
        
        const user = await User.findById(loggedInUserId).select("blockedUsers")
        
        res.status(200).json(user.blockedUsers)
    } catch (error) {
        console.log("Error in getBlockedUsers controller: ", error.message)
        res.status(500).json({ error: "Internal server error"})
    }
};//returns list of the current users blocked user array

