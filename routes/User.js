const express=require("express")
const mongoose=require("mongoose")
const router=express.Router()
const bcrypt=require("bcryptjs")
const Users=require("../models/UserSchema")




router.post("/register",async (req,res,next)=>{
    try{
    const {email,password,Fullname,username}=req.body
    console.log(req.body)
   Users.findOne({Username:username})
   .exec()
   .then((user)=>{
    if(user){
        return res
        .status(409)
        .json({message:"User already exists"})
        }
        else
            {
                bcrypt.genSalt(10, function(err, salt)
                    {
                        if(err){
                            throw Error;
                        }
                        bcrypt.hash(password, salt, function(err, hash)
                        {
                            if (err) {
                                return res.status(500).json({
                                error: err,
                                });
                            }
                            const user=new Users({
                                _id: new mongoose.Types.ObjectId(),
                                Username:username,
                                Password:hash,
                                Fullname:Fullname,
                                Email:email
                            })
                            user.save()
                            .then((result) => {
                                res.status(200).json({
                                new_user: result,
                                });
                            })
                            .catch((err) => {
                                res.status(500).json({
                                error: err,
                                });
                            });
                        });
                    })
            }
        })
    }
    catch(error){
        console.log("error is ",error)
    }

})



router.post("/login",(req,res,next)=>{
    const {username,password}=req.body
    console.log(req.body)
    Users.findOne({Username:username})
    .exec()
    .then((user)=>{
        if(!user){
            res.status(401).json({message:"User not exist"})
        }
        else{
            bcrypt.compare(password,user.Password, (err, result) => {
                if (!result) {
                  return res.status(401).json({
                    msg: "invalid credentials",
                  });
                }
                else{
                    return res.status(200).json({
                        message:"Logged In",
                        data:user._id
                    })
                }
            })
        }
    })

})

module.exports=router;
