import jwt from "jsonwebtoken";
import User from "../model/User.js";

export const authMiddlware=async(req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        if(!token) return res.status(400).json({message:"token not found"});
        
        const decodetoken=jwt.verify(token,process.env.JWT_KEY);
        if(!decodetoken) return res.status(400).json({message:"invalid token"});
    
        const user=await User.findById(decodetoken.userId)
    
        if(!user) return res.status(400).json({message:"User not found"})
        req.user=user;
        next();
    } catch (error) {
        console.log("auth middlware error is"+error)
        res.status(500).json({message:"internal server Error"});
    }
}
