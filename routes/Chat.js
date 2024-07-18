const express = require("express");
const router = express.Router();
const Chat = require('../models/ChatSchema');
const User = require('../models/UserSchema');

const createRoomId = (id1, id2) => {
    return [id1, id2].sort().join('_');
};

// POST endpoint for saving chat messages
router.post('/chat', async (req, res) => {

    
    const { sender_id, receiver_id, message } = req.body;
    const room_id = createRoomId(sender_id, receiver_id);
    console.log(room_id)

    try {
        console.log("ji")
        let chat = await Chat.findOne({ room_id });

        if (!chat) {
            chat = new Chat({
                room_id,
                participants: [sender_id, receiver_id],
                messages: []
            });
        }

        const newMessage = {
            sender_id,
            message
        };

        chat.messages.push(newMessage);
        await chat.save();

        res.status(201).json(chat);
    } catch (err) {
        console.error("Error saving message:", err);
        res.status(500).json({ error: "Failed to save message" });
    }
});


router.get('/chat/:userId1/:userId2', async (req, res) => {
    const { userId1, userId2 } = req.params;
    const room_id = createRoomId(userId1, userId2);
    console.log("this is retiver",room_id)

    try {
        const chat = await Chat.findOne({ room_id }).populate('participants').sort({ 'messages.createdAt': 1 });

        if (!chat) {
            return res.status(404).json({ error: "No chat found" });
        }

        res.status(200).json(chat.messages);
    } catch (err) {
        console.error("Error retrieving messages:", err);
        res.status(500).json({ error: "Failed to retrieve messages" });
    }
});

module.exports = router;
