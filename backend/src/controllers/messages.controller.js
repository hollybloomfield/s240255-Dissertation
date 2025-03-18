import Chats from "../models/chats.model.js"
import Message from "../models/message.model.js";
import User from "../models/user.model.js"


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

        const chatsUserIds = chats.map(chat =>
            chat.user1.equals(loggedInUserId) ? chat.user2 : chat.user1 //return user2 if user1 equal to loggedinuserid, if not return user1
        )

        const chatUsers = await User.find({_id:{$in: chatsUserIds}}).select("-password") //find all users in chatuserIds and return everything except password

        res.status(200).json(chatUsers)
    } catch (error) {
        console.log("Error in getChatUsers: ", error.message)
        res.status(500).json({error: "Internal server error"})
    }  
};

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
};

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

        // to do: real time functionality with socket.io

        res.status(201).json(newMessage)


    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message)
        res.status(500).json({error: "Internal server error"})
    }
};