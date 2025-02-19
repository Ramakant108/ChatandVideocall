import mongoose, { model, Model } from "mongoose";

const usrSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    fullName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minlenght:8
    },
    profile:{
        type:String,
        default:""
    }
},
  {timestamps:true}
)

const User=mongoose.model("User",usrSchema);

export default User;