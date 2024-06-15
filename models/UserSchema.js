const mongoose=require("mongoose")
const Post =require("../models/PostSchema")
const Users=mongoose.Schema({
    Username:{
        type:String,
        required:true,
        unique : true
    },
    Password:{
        type:String,
        required:true,
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    Fullname:{
        type:String,
    },
    Profile_Picture:{
        type:String,
        default:"https://cdn.landesa.org/wp-content/uploads/default-user-image.png"
    },
    About:{
        type:String
    },
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post' // Reference the Post model
    }]

})
module.exports = mongoose.model('Users',Users)