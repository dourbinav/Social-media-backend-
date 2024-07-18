const mongoose = require("mongoose");
const User=require("../models/UserSchema")

const messageSchema = new mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ChatSchema = new mongoose.Schema({
    room_id: {
        type: String,
        required: true,
        unique: true
    },
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: User
        }
    ],
    messages: [messageSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Chat', ChatSchema);
