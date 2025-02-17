import express from "express";
import { login, logout, signup, updateProfile, checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

///api/auth routes


router.post("/signup", signup )

router.post("/login", login)

router.post("/logout", logout)
//MIGHT MOVE THIS TO USER ROUTE
// protectRoute first checks that user is authenticated
router.put("/update-profile", protectRoute, updateProfile)

//check if user is authenticated, called whenever application is refreshed
router.get("/check", protectRoute, checkAuth)

export default router;