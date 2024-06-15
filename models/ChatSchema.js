const mongoose=require("mongoose")
const User=require("../models/UserSchema")
const ChatSchema=mongoose.Schema({
    message:{
        type:String,required:true},
sender_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},
reciever_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true  
}
},{
    timestamp:true
})

module.exports=mongoose.model('Chat',ChatSchema)