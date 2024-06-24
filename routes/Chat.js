const express = require("express");
const router = express.Router();
const Chat = require('../models/ChatSchema'); // Adjust the path based on your project structure
const User=require('../models/UserSchema')

// POST endpoint for saving chat messages
router.post('/chat', async (req, res, next) => {
    const { sender_id, reciever_name,message} = req.body;

    try {
       
        const receiver = await User.findOne({ Username: reciever_name });

       if (!receiver) {
           return res.status(404).json({ error: "Receiver not found" });
       }
        const newMessage = new Chat({
            sender_id,
            message,
            reciever_id: receiver._id
        });

        const savedMessage = await newMessage.save();

        res.status(201).json(savedMessage); // Respond with saved message object
    } catch (err) {
        console.error("Error saving message:", err);
        res.status(500).json({ error: "Failed to save message" });
    }
});

module.exports = router;
