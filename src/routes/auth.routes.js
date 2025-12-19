const express =require('express')
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const router = express.Router()

router.post('/register',async(req,res)=>{

   const {username,password}=req.body;

   await userModel.create({
    username,password
   })
  
   res.status(201).json({
    message:"user created sucessfully "
   })
})

router.post('/login',async(req,res)=>{

   const {username,password}=req.body;
   const user = await userModel.findOne({
    username:username
   })
   if(!user){
    return res.status(301).json({
        message:"Unauthorized"
    })
   }
   const isPassCorrect =  password ==  user.password;
   console.log(isPassCorrect)
   if(!isPassCorrect){
     return res.status(301).json({
        message:"Invalid pass"
    })   
}
   const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
   res.cookie('token',token)
   res.status(201).json({
    message:"user logged in sucessfully "
   })
})

router.get('/user',async(req,res)=>{
    const {token} = req.cookies
    if(!token){
        return res.send({
            message:"Unauthorized access"
        })
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await userModel.findOne({
            _id:decoded.id
        }).select("-password -__v")
        res.status(201).json({
            message:"Found user",
            user
        })        
        console.log(decoded)
    } catch (error) {
        res.status(401).json({
            message:"Unauthorized access"
        })
    }
})

module.exports = router