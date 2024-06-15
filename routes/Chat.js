const express=require("express")
const router=express.Router()
const Chat=require('/models/ChatSchema')

router.post('/Chat',(req,res,next)=>{
    const {sender_id,message, reciever_id}=req.body;
    
})