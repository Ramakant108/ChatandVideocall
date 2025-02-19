import toast from "react-hot-toast";
import { axiosInstance } from "../utility/axios";
import { create } from "zustand";
import { io } from "socket.io-client";
const baseURL=process.env.NODE_ENV==="development" ? "http://localhost:5000/api" : "/"
export const useAuthStore=create((set,get)=>({
    authUser:null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    socket:null,
    checkAuth:async()=>{
        try {
            const response=await axiosInstance.get("auth/check");
            set({authUser:response.data})
            get().connection()
        } catch (error) {
            console.log("error in checkAuth :"+error);
            set({authUser:null})
        }finally{
            set({isCheckingAuth:false})
        }
    },
    signup:async(data)=>{
        set({isSigningUp:true})
        try {
            const res=await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            get().connection()
            toast.success("Signup Successfuly")
        } catch (error) {
            console.log("error in signup :"+error);
            toast.error("Error :"+error.response.data.message)
        }finally{
            set({isSigningUp:false})
        }
    },
    login:async(data)=>{
        set({isLoggingIn:true});
        try {
            const res=await axiosInstance.post("/auth/login",data);
            set({authUser:res.data})
            get().connection()
            toast.success("Login Successfuly")
        } catch (error) {
            console.log("error in login :"+error);
            toast.error("Error :"+error.response.data.message)
        }finally{
            set({isLoggingIn:false})
        }
    }, 
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.put("/auth/update-profile", data);
          set({ authUser: res.data });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.log("error in update profile:", error);
          toast.error(error.response.data.message);
        } finally {
          set({ isUpdatingProfile: false });
        }
      },
    logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          set({ authUser: null,socket:null });
          get().disConnect();
          toast.success("Logout Successfuly")
        } catch (error) {
            console.log("error in logout :"+error);
            toast.error("Error :"+error.response.data.message)
        }
      },
      connection:()=>{
        const socket = io(baseURL,{
            query:{
                userId:get().authUser._id, 
            }
        });
        socket.connect();
        console.log(socket.id);
        set({socket:socket})
      },
      disConnect:()=>{
        if (get().socket) get().socket.disconnect();
    }
}))