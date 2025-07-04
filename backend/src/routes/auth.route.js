import express from "express";
import { login, logout, signup, updateProfile, checkAuth, changePassword } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

///api/auth routes


router.post("/signup", signup )

router.post("/login", login)

router.post("/logout", logout)

// protectRoute first checks that user is authenticated
router.put("/update-profile", protectRoute, updateProfile)

//check if user is authenticated, called whenever application is refreshed
router.get("/check", protectRoute, checkAuth)

router.put("/change-password", protectRoute, changePassword)

export default router;