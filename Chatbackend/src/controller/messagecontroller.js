import cloudinary from "../helper/cloudnary.js";
import { getsocketIdOfReciever, io } from "../helper/socket.js";
import Message from "../model/Messages.js";
import User from "../model/User.js";

export const getuserForsidebar=async(req,res)=>{

    try {
        const loginUser=req.user._id;
        const filteruser=await User.find({_id:{$ne:loginUser}}).select("-password");
        res.status(200).json(filteruser)
    } catch (error) {
        console.log("error in getalluser "+error.message)
        res.status(500).json({message:"internal server Error"});
    }
}


export const getMessages=async(req,res)=>{
    try {
        const senderid=req.user._id;
        const {id}=req.params;
          
        const messages=await Message.find({
            $or:[
                {senderId:senderid,receiverId:id},
                {senderId:id,receiverId:senderid}
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log("error in getmessage "+error.message)
        res.status(500).json({message:"internal server Error"});
    }
}

export const sendMessage=async(req,res)=>{
    try {
        const {text,image}=req.body;
        const senderid=req.user._id;
        const {id}=req.params;
        let imageUrl;
        if(image){
          const uploadresponse=await cloudinary.uploader.upload(image);
          imageUrl=uploadresponse.secure_url;
        }

        const newMessage=new Message({
            senderId:senderid,
            receiverId:id,
            text,
            image:imageUrl
        })

        await newMessage.save();

        const receiverSocketID = getsocketIdOfReciever(id);
        if (receiverSocketID) {
            console.log(`Sending message to socket ID: ${receiverSocketID}`);
            io.to(receiverSocketID).emit("newMessage", newMessage);
        } else {
            console.log(`Receiver is not online, message stored in DB`);
        }
        
        res.status(200).json(newMessage)
    } catch (error) {
        console.log("error in getmessage "+error.message)
        res.status(500).json({message:"internal server Error"});
    }
        
}
