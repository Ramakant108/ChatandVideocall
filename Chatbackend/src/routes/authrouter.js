import express from "express";

import { checkAuth, login, logout, signup, updateProfile } from "../controller/authcontroller.js";
import { authMiddlware } from "../middlware/authmiddleware.js";

const router=express.Router();

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout )

router.put("/update-profile",authMiddlware,updateProfile)

router.get("/check",authMiddlware,checkAuth)
export default router;