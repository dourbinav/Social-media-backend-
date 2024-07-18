require("dotenv").config();
const mongoose = require("mongoose");
const http = require('http');
const express = require("express");
const { Server } = require("socket.io");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");

const post = require("./routes/Post");
const user = require("./routes/User");
const search = require("./routes/Search");
const chatRoutes = require("./routes/Chat");
const Chat = require("./models/ChatSchema");
const dbUrl = process.env.MONGO_DB;

const server = http.createServer(app);

// Connect to MongoDB
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("error", (err) => {
    console.log("MongoDB connection error:", err);
});
mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(fileupload({ useTempFiles: true }));

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('sendMessage', async (msg) => {
        try {
            const { message, sender_id, receiver_id } = msg;
            const room_id = `${sender_id}_${receiver_id}`;

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

        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Routes
app.use("/user", user);
app.use("/post", post);
app.use("/search", search);
app.use("/chat", chatRoutes);

server.listen(9090, () => {
    console.log("Server is running on port 9090");
});
