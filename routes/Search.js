const express=require("express")
const User=require("../models/UserSchema")
const router=express.Router()

 router.post("/",async(req,res)=>{
    try{
        const { username } = req.body;
        const regex = new RegExp(username, 'i'); 
        const users = await User.find({ Username: { $regex: regex } });
      
        if (!users || users.length === 0) {
          return res.status(401).send('No match found');
        }
      else{
        const userdata=users.map((user)=>({
            username:user.Username,
            profile_picture:user.Profile_Picture}))
      return  res.status(200).json({
        message:"success",
        data:userdata
        })
    }
    }
    catch(error){
        return   res.status(500).json({"message": error});
    }
 })


module.exports=router