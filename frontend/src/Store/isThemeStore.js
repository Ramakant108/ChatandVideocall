import { create } from "zustand";




export const useThemeStore=create((set)=>({
    themes:localStorage.getItem("chat-theme")||'dark',
    setTheme:(theme)=>{
       localStorage.setItem("chat-theme",theme)
       set({themes:theme})
    }
}))