const express = require("express");
const router = express.Router();
const Chat = require('../models/ChatSchema'); // Adjust the path based on your project structure

// POST endpoint for saving chat messages
router.post('/chat', async (req, res, next) => {
    const { sender_id, message, receiver_id } = req.body;

    try {
        // Create a new chat message instance
        const newMessage = new Chat({
            sender_id,
            message,
            receiver_id
        });

        // Save the message to the database
        const savedMessage = await newMessage.save();

        res.status(201).json(savedMessage); // Respond with saved message object
    } catch (err) {
        console.error("Error saving message:", err);
        res.status(500).json({ error: "Failed to save message" });
    }
});

module.exports = router;
