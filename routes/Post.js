const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema");
const Post = require("../models/PostSchema");
const cloudinary = require("cloudinary").v2;
const fileUpload = require('express-fileupload');

cloudinary.config({ 
    cloud_name: 'dbuzs2frj', 
    api_key: '699111754166464', 
    api_secret: 'lrGRgnnjT4DIG3Gimc1Rj2057EM' 
});

router.get("/", (req, res) => {
    Post.find({})
        .populate('Userid', 'Username Profile_Picture') // Populate with Username and Profile_Picture
        .then((result) => {
            res.status(200).json({
                posts: result
            });
        }).catch((error) => {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        });
});

router.post("/personnel", (req, res) => {
    const { id } = req.body;
    Post.find({ Userid: id })
        .populate('Userid', 'Username Profile_Picture') 
        .then((result) => {
            res.status(200).json({
                posts: result
            });
        }).catch((error) => {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        });
});

router.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// Route to handle adding a post
router.post('/profile', async (req, res) => {
    try {
        const { caption, userid } = req.body;
        const file = req.files.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(file.tempFilePath);

        // Create a new post
        const newpost = new Post({
            Userid: userid,
            PostUrl: result.url,
            Caption: caption,
        });

        // Save the new post
        await newpost.save();

        // Find the user by ID
        const user = await User.findById(userid);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Add the post to the user's posts array
        user.posts.push(newpost);

        // Save the updated user
        await user.save();

        console.log(newpost);
        res.status(201).json({ message: 'Post created successfully', post: newpost });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.patch("/update", async (req, res) => {
    const file = req.files.photo;
    const { id } = req.body;
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath);
        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({
                message: 'No such user exists!'
            });
        }
        user.Profile_Picture = result.url;
        await user.save();

        res.status(200).json({
            msg: "Profile updated"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "An error occurred while updating picture"
        });
    }
});

module.exports = router;
