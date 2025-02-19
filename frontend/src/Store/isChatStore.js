 import { axiosInstance } from "../utility/axios.js";
import toast from "react-hot-toast";
import { create } from "zustand";
import { useAuthStore } from "./isAuthStore.js";

export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isuserLoading:false,
    ismessagesLoading:false,
    getUsers:async()=>{
        set({isuserLoading:true});
        try {
            const res=await axiosInstance.get("/message/getusers");
            set({users:res.data});
        } catch (error) {
            toast.error(error)
        }finally {
            set({ isuserLoading: false });
          }
    },
    getMessages:async(userId)=>{
        set({ismessagesLoading:true})
        try {
            const res=await axiosInstance.get(`/message/getmessage/${userId}`)
            set({messages:res.data})
        } catch (error) {
            toast.error(error)
        }
        finally{
            set({ismessagesLoading:false})
        }
        
    },
    sendMessages:async(messageData)=>{
        const {selectedUser,messages}=get();
        try{
            const res=await axiosInstance.post(`/message/sendmessage/${selectedUser._id}`,messageData);
            set({messages:[...messages,res.data]})
        }catch (error) {
            toast.error(error)
        }

    },
    subcribeMessages:()=>{
        const {selectedUser}=get()
        const socket = useAuthStore.getState().socket;
        if(!selectedUser) return;

        socket.on("newMessage",(newMessage)=>{
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
             if (!isMessageSentFromSelectedUser) return;
             set({messages:[...get().messages,newMessage]})
        })
    },
    unSubcribeMessages:()=>{
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
    selectUser:(user)=>set({selectedUser:user})
}))