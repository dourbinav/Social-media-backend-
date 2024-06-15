const mongoose=require("mongoose")
const Users=require("./UserSchema")

const PostSchema=mongoose.Schema({
    Userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', // Reference the User model
        required: true
    },
    PostUrl:{
        type:String
    },
    Caption:{
        type:String
           },
    Comments:[String],
    Likes:Number,

})
module.exports = mongoose.model('Post', PostSchema);