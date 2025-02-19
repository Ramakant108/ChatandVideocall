import jwt from "jsonwebtoken";

export const generatejwttoken=(userId,res)=>{

    const token=jwt.sign({userId},process.env.JWT_KEY,{expiresIn:"7d"});

    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,
        httpOnly:true,
        sameSite:"strict",
    })

    return token;
}