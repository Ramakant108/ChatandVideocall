import cloudinary from "../helper/cloudnary.js";
import { generatejwttoken } from "../helper/utils.js"
import User from "../model/User.js"
import bcryptjs from "bcryptjs"

export const login=async(req,res)=>{
    const {email,password}=req.body;

    try {

        if(!email||!password){
            return res.status(400).json({message:"All fild are required must"});
        }

        const user=await User.findOne({email});

        if(!user) return res.status(400).json({message:"User not found"});

        const iscorrect=await bcryptjs.compare(password,user.password);

        if(!iscorrect) return res.status(400).json({message:"invalid password"});

        generatejwttoken(user._id,res);

        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profile:user.profile
        })

    } catch (error) {
        console.log("error in signup controll"+error.message)
        res.status(500).json({message:"internal server Error"});
    }

}

export const logout=(req,res)=>{
    try {
        res.cookie("jwt","",{minAge:0});
        res.status(200).json({message:"Logout successfully"})
    } catch (error) {
        
    }
}

export const signup=async(req,res)=>{
    const {email,password,fullName}=req.body;
    try {
        if(!email||!password||!fullName){
            return res.status(400).json({message:"All fild are requred"})
        }
        if(password.length<6){
           return res.status(400).json({message:"Password must be min 6 digit"})
        }

        const user=await User.findOne({email});
        if(user) return res.status(400).json({message:"Email alredy exist"});

        const salt =await bcryptjs.genSalt(10);
        const hasedPassword=await bcryptjs.hash(password,salt);

        const newUser=new User({
            email,
            fullName,
            password:hasedPassword
        })

        if(newUser){
            generatejwttoken(newUser._id,res);
            await newUser.save();

           res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profile:newUser.profile
            })
        }else{
         res.status(400).json({message:"invalid information"})
        }
    } catch (error) {
        console.log("error in signup controll"+error.message)
       res.status(500).json({message:"internal server Error"});
    }
}


export const updateProfile=async(req,res)=>{
    try {
        const {profile}=req.body;
    const userId=req.user._id;

    if(!profile) return res.status(400).json({message:"The profile pic is required"})

    const updateresponse= await cloudinary.uploader.upload(profile);
    const updatedUser=await User.findByIdAndUpdate(userId,{profile:updateresponse.secure_url},{new:true})

    res.status(200).json(updatedUser)
    } catch (error) {
        console.log("error in updateprofil "+error.message)
        res.status(500).json({message:"internal server Error"});
    }
    
}

export const checkAuth=(req,res)=>{
      try {
        res.status(200).json(req.user)
      } catch (error){
        console.log("error in checkAuth "+error.message)
        res.status(500).json({message:"internal server Error"});
      }
}