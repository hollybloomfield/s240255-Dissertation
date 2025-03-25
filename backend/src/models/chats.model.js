import mongoose from "mongoose";

const chatsSchema = new mongoose.Schema(
    {
        user1: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        user2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        lastMessage: {
            type: String,
            ref: "Message",
            default: "",
        }, 
    },
    {timestamps: true}
)

const Chats = mongoose.model("Chats", chatsSchema);

export default Chats;