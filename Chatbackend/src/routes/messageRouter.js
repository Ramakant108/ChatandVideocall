import express from "express"
import { getMessages, getuserForsidebar, sendMessage } from "../controller/messagecontroller.js";
import { authMiddlware } from "../middlware/authmiddleware.js";
const router=express.Router()

router.get("/getusers",authMiddlware,getuserForsidebar);
router.get("/getmessage/:id",authMiddlware,getMessages);
router.post("/sendmessage/:id",authMiddlware,sendMessage)


export default router;