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
    },
    {timestamps: true}
)

//enables each pair of ids to be unique regardless of order
chatsSchema.index({user1: 1, user2: 1}, {unique: true})

const Chats = mongoose.model("Chats", chatsSchema);

export default Chats;